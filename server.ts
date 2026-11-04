import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendOtpCode, verifyOtpCode, validateAndConsumeToken } from './src/server/otpService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints for OTP Verification
app.post('/api/otp/send', async (req, res) => {
  const { email, purpose } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const result = await sendOtpCode(email || '', purpose || 'verification', clientIp);
  res.status(result.status).json(result);
});

app.post('/api/otp/verify', (req, res) => {
  const { email, code, purpose } = req.body;
  const result = verifyOtpCode(email || '', code || '', purpose || 'verification');
  res.status(result.status).json(result);
});

app.post('/api/forms/submit', (req, res) => {
  const { email, verificationToken, purpose } = req.body;
  const isValid = validateAndConsumeToken(verificationToken, email, purpose);
  if (!isValid) {
    return res.status(403).json({
      success: false,
      error: 'Verification token is invalid, expired, or already used. Please verify your email again.',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Verified form submission accepted.',
    receivedAt: new Date().toISOString(),
  });
});

app.get('/api/otp/status', (_req, res) => {
  const hasKey = Boolean(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);
  res.json({
    status: 'active',
    emailProviderConfigured: hasKey,
    provider: 'Resend',
  });
});

// Production static assets serving
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`HEAVENLY-RUN server running on port ${port}`);
});
