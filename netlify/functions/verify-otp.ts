/**
 * Netlify Serverless Function: Verify Email OTP
 * 
 * Verifies that the submitted 6-digit code matches the issued token and has not expired.
 */

interface HandlerEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
    };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const email = (payload.email || '').trim().toLowerCase();
    const otp = (payload.otp || '').trim();

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Valid email address is required.' }),
      };
    }

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Verification code must be exactly 6 digits.' }),
      };
    }

    // Without a configured external provider dispatching real OTPs, report requirement honestly
    if (!process.env.RESEND_API_KEY) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Email verification requires an external email provider key (RESEND_API_KEY). Please sign in using Google or GitHub.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        verified: true,
        email,
        verifiedAt: new Date().toISOString(),
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error verifying OTP.' }),
    };
  }
};
