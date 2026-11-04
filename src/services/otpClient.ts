/**
 * Client service for calling real 6-digit email OTP verification endpoints
 */

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  serviceStatus?: string;
  expiresInSeconds?: number;
  cooldownRemaining?: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  verificationToken?: string;
  email?: string;
  attemptsRemaining?: number;
}

export async function requestEmailOtp(email: string, purpose: string): Promise<SendOtpResponse> {
  try {
    const res = await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Network connectivity failure. Unable to reach verification server.',
    };
  }
}

export async function verifyEmailOtp(email: string, code: string, purpose: string): Promise<VerifyOtpResponse> {
  try {
    const res = await fetch('/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Network connectivity failure. Unable to verify code.',
    };
  }
}

export async function submitVerifiedForm(payload: {
  email: string;
  verificationToken: string;
  purpose: string;
  formData: any;
}): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const res = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Network connectivity failure while submitting form.',
    };
  }
}
