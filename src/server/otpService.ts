import crypto from 'crypto';
import { Resend } from 'resend';

// Disposable email domains blacklist
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'yopmail.com',
  'throwawaymail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'nada.ltd',
  'mohmal.com',
  'burnermail.io',
  'mytemp.email',
]);

interface OtpEntry {
  email: string;
  hashedCode: string;
  salt: string;
  expiresAt: number;
  resendAfter: number;
  attempts: number;
  purpose: string;
}

interface VerificationTokenEntry {
  email: string;
  purpose: string;
  token: string;
  expiresAt: number;
}

// In-memory security records (isolated and rate-limited)
const otpStore = new Map<string, OtpEntry>();
const verifiedTokenStore = new Map<string, VerificationTokenEntry>();

// Global Rate-Limiting by IP/Email
const requestRateStore = new Map<string, { count: number; resetAt: number }>();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 3;
const TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function hashOtp(code: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(code).digest('hex');
}

export function isDisposableEmail(email: string): boolean {
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(parts[1]);
}

export function checkRateLimit(key: string, maxRequests = 5, windowMs = 60000): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = requestRateStore.get(key);

  if (!entry || now > entry.resetAt) {
    requestRateStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

export async function sendOtpCode(email: string, purpose: string, clientIp?: string) {
  const cleanEmail = email.trim().toLowerCase();

  // Validate format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, status: 400, error: 'Please provide a valid email address.' };
  }

  // Reject disposable email domains
  if (isDisposableEmail(cleanEmail)) {
    return {
      success: false,
      status: 400,
      error: 'Disposable and temporary email addresses are rejected for security reasons. Please use a verified provider.',
    };
  }

  // IP/Email rate check
  const rateKey = `${clientIp || 'client'}:${cleanEmail}`;
  const rateLimit = checkRateLimit(rateKey, 4, 60000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      status: 429,
      error: `Too many verification requests. Please wait ${rateLimit.retryAfter}s before requesting again.`,
    };
  }

  const now = Date.now();
  const storeKey = `${cleanEmail}:${purpose}`;
  const existing = otpStore.get(storeKey);

  // Check 60-second cooldown
  if (existing && now < existing.resendAfter) {
    const waitSeconds = Math.ceil((existing.resendAfter - now) / 1000);
    return {
      success: false,
      status: 429,
      error: `Please wait ${waitSeconds}s before requesting a new code.`,
      cooldownRemaining: waitSeconds,
    };
  }

  // Generate cryptographically secure 6-digit code
  const codeInt = crypto.randomInt(100000, 1000000);
  const code = codeInt.toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedCode = hashOtp(code, salt);

  // Store active entry
  otpStore.set(storeKey, {
    email: cleanEmail,
    hashedCode,
    salt,
    expiresAt: now + OTP_EXPIRY_MS,
    resendAfter: now + RESEND_COOLDOWN_MS,
    attempts: 0,
    purpose,
  });

  // Check Resend Configuration
  const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'HEAVENLY-RUN ENERGY <onboarding@resend.dev>';

  if (!resendApiKey) {
    // Exact requirement: Never fake simulated OTP if email provider is unconfigured.
    // Display clear status message informing user to configure credentials.
    return {
      success: false,
      status: 503,
      serviceStatus: 'offline',
      error:
        'Email verification service is offline: RESEND_API_KEY is not configured on the server. Please configure RESEND_API_KEY in your deployment environment.',
    };
  }

  try {
    const resend = new Resend(resendApiKey);
    const brandSubject = `HEAVENLY-RUN ENERGY — Verification Code: ${code}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { background-color: #090B12; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; }
            .card { max-width: 500px; margin: 0 auto; background: #0E1322; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
            .logo { font-size: 20px; font-weight: 900; letter-spacing: 0.2em; color: #FFFFFF; text-align: center; margin-bottom: 4px; }
            .tagline { font-size: 11px; letter-spacing: 0.3em; color: #A8D8FF; text-align: center; text-transform: uppercase; margin-bottom: 24px; }
            .code-box { background: rgba(23, 107, 255, 0.15); border: 1px solid rgba(23, 107, 255, 0.4); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
            .code { font-size: 36px; font-weight: 900; letter-spacing: 0.25em; color: #FFFFFF; font-family: monospace; }
            .desc { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.7); text-align: center; }
            .footer { font-size: 11px; color: rgba(255,255,255,0.4); text-align: center; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">HEAVENLY-RUN</div>
            <div class="tagline">RISE ABOVE ORDINARY</div>
            <p class="desc">You requested identity verification for <strong>${purpose}</strong>. Use the 6-digit one-time code below:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p class="desc">This code expires in <strong>5 minutes</strong> and can only be used once. If you did not request this code, no action is needed.</p>
            <div class="footer">
              © ${new Date().getFullYear()} HEAVENLY-RUN ENERGY. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: cleanEmail,
      subject: brandSubject,
      html: htmlContent,
    });

    if (sendError) {
      console.error('Resend email error:', sendError);
      return {
        success: false,
        status: 500,
        error: `Email delivery failed: ${sendError.message || 'Unknown provider error'}.`,
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Verification code successfully dispatched to your email.',
      expiresInSeconds: 300,
      cooldownSeconds: 60,
    };
  } catch (err) {
    console.error('Email sending exception:', err);
    return {
      success: false,
      status: 500,
      error: 'An unexpected error occurred while sending the verification email.',
    };
  }
}

export function verifyOtpCode(email: string, code: string, purpose: string) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim().replace(/\s+/g, '');
  const storeKey = `${cleanEmail}:${purpose}`;
  const entry = otpStore.get(storeKey);

  if (!entry) {
    return {
      success: false,
      status: 400,
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  const now = Date.now();

  // Check expiration (5 minutes)
  if (now > entry.expiresAt) {
    otpStore.delete(storeKey);
    return {
      success: false,
      status: 400,
      error: 'Verification code has expired (5-minute limit). Please request a new code.',
    };
  }

  // Check max incorrect attempts
  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(storeKey);
    return {
      success: false,
      status: 403,
      error: 'Maximum incorrect verification attempts exceeded. Code invalidated for security.',
    };
  }

  const candidateHash = hashOtp(cleanCode, entry.salt);
  if (candidateHash !== entry.hashedCode) {
    entry.attempts += 1;
    const remaining = MAX_ATTEMPTS - entry.attempts;
    return {
      success: false,
      status: 400,
      error: `Invalid verification code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Code locked.'}`,
      attemptsRemaining: remaining,
    };
  }

  // Code verified! Invalidate single-use OTP
  otpStore.delete(storeKey);

  // Generate cryptographic single-use verification token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenEntry: VerificationTokenEntry = {
    email: cleanEmail,
    purpose,
    token,
    expiresAt: now + TOKEN_EXPIRY_MS,
  };

  verifiedTokenStore.set(token, tokenEntry);

  return {
    success: true,
    status: 200,
    message: 'Email identity successfully verified.',
    verificationToken: token,
    email: cleanEmail,
  };
}

export function validateAndConsumeToken(token: string, email: string, purpose: string): boolean {
  if (!token) return false;
  const entry = verifiedTokenStore.get(token);
  if (!entry) return false;

  const now = Date.now();
  if (now > entry.expiresAt) {
    verifiedTokenStore.delete(token);
    return false;
  }

  if (entry.email !== email.trim().toLowerCase() || entry.purpose !== purpose) {
    return false;
  }

  // Single use: consume token
  verifiedTokenStore.delete(token);
  return true;
}
