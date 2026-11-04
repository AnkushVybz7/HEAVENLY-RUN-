import React, { useState, useEffect } from 'react';
import { requestEmailOtp, verifyEmailOtp } from '../services/otpClient';
import { ShieldCheck, Mail, KeyRound, Clock, AlertTriangle, CheckCircle2, RotateCw, Lock } from 'lucide-react';

interface EmailOtpVerifierProps {
  email: string;
  onEmailChange?: (email: string) => void;
  purpose: string;
  isVerified: boolean;
  onVerified: (email: string, token: string) => void;
  disabled?: boolean;
}

export const EmailOtpVerifier: React.FC<EmailOtpVerifierProps> = ({
  email,
  onEmailChange,
  purpose,
  isVerified,
  onVerified,
  disabled = false,
}) => {
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Timers
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(0);

  // Cooldown countdown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Expiry countdown
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          setErrorMessage('Verification code expired. Please request a new code.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expirySeconds]);

  const handleSendCode = async () => {
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address before requesting verification.');
      return;
    }

    setIsSending(true);
    try {
      const res = await requestEmailOtp(cleanEmail, purpose);
      if (res.success) {
        setCodeSent(true);
        setStatusMessage('6-digit verification code sent to your email.');
        setCooldownSeconds(60);
        setExpirySeconds(300); // 5 minutes
      } else {
        setErrorMessage(res.error || 'Failed to dispatch verification code.');
        if (res.cooldownRemaining) {
          setCooldownSeconds(res.cooldownRemaining);
        }
      }
    } catch {
      setErrorMessage('Network error while requesting verification code.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanCode = code.trim().replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit numeric verification code.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyEmailOtp(email, cleanCode, purpose);
      if (res.success && res.verificationToken) {
        setStatusMessage('Email identity verified successfully!');
        onVerified(email, res.verificationToken);
      } else {
        setErrorMessage(res.error || 'Verification failed. Please check the code.');
      }
    } catch {
      setErrorMessage('Network error while validating code.');
    } finally {
      setIsVerifying(false);
    }
  };

  // If already verified
  if (isVerified) {
    return (
      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs font-tech">
        <div className="flex items-center gap-2 text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Email verified: <strong className="text-white font-mono">{email}</strong>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-widest uppercase">
          VERIFIED
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 font-tech">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-blue-300 font-bold tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>IDENTITY VERIFICATION REQUIRED</span>
        </div>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">
          {codeSent ? (expirySeconds > 0 ? `Code expires in ${Math.floor(expirySeconds / 60)}:${(expirySeconds % 60).toString().padStart(2, '0')}` : 'Code Expired') : '6-Digit OTP'}
        </span>
      </div>

      <p className="text-[11px] text-white/60 leading-relaxed">
        To prevent spam and protect laboratory submissions, verify your email with a 6-digit one-time passcode.
      </p>

      {/* Email input field if onEmailChange provided */}
      {onEmailChange && (
        <div>
          <label className="block text-[11px] text-white/70 uppercase tracking-wider mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              disabled={disabled || isVerified}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-xs font-tech focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Action: Send Code or Resend */}
      {!codeSent ? (
        <button
          type="button"
          onClick={handleSendCode}
          disabled={isSending || disabled || !email}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-tech font-bold tracking-wider text-black bg-gradient-to-r from-blue-400 via-indigo-200 to-white hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSending ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>GENERATING SECURE CODE...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-3.5 h-3.5" />
              <span>SEND VERIFICATION CODE</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] text-white/70 uppercase tracking-wider mb-1">
              Enter 6-Digit Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="flex-grow px-3 py-2.5 rounded-xl bg-black/80 border border-blue-500/50 text-white font-mono text-center text-base tracking-[0.3em] font-bold focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isVerifying || code.trim().length !== 6}
                className="px-5 py-2.5 rounded-xl text-xs font-tech font-bold tracking-wider text-black bg-blue-400 hover:bg-blue-300 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
              >
                {isVerifying ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>VERIFY</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-white/40" />
              <span>Sent to: {email}</span>
            </span>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={cooldownSeconds > 0 || isSending}
              className="text-blue-400 hover:text-blue-300 disabled:text-white/30 cursor-pointer font-bold transition-colors"
            >
              {cooldownSeconds > 0 ? `Resend code in ${cooldownSeconds}s` : 'Resend code'}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && !errorMessage && (
        <div className="p-2.5 rounded-lg bg-blue-950/50 border border-blue-500/40 text-blue-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
