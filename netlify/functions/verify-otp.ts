import type { Handler } from '@netlify/functions';
import { verifyOtpCode } from '../../src/server/otpService';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { email, code, purpose } = body;

    const result = verifyOtpCode(email || '', code || '', purpose || 'verification');
    return {
      statusCode: result.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
    };
  }
};
