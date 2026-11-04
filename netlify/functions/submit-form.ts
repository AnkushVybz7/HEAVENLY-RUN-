import type { Handler } from '@netlify/functions';
import { validateAndConsumeToken } from '../../src/server/otpService';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { email, verificationToken, purpose } = body;

    const isValid = validateAndConsumeToken(verificationToken, email, purpose);
    if (!isValid) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Verification token is invalid, expired, or already used. Please verify your email again.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Verified form submission accepted.',
        receivedAt: new Date().toISOString(),
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
    };
  }
};
