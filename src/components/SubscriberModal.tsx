import React, { useState } from 'react';
import {
  addSubscriberToFirestore,
  loginWithGoogle,
  loginWithGithub,
  loginWithApple,
} from '../services/firebase';
import {
  Sparkles,
  Trophy,
  Check,
  ShieldCheck,
  ArrowRight,
  Lock,
  KeyRound,
  AlertTriangle,
  ArrowLeft,
  X,
  Loader2,
} from 'lucide-react';

interface SubscriberModalProps {
  isOpen: boolean;
  onSuccess: (isAdmin: boolean, userData: { name: string; email: string }) => void;
  onClose?: () => void;
}

export const SubscriberModal: React.FC<SubscriberModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wantsLimitedCan, setWantsLimitedCan] = useState(true); // Tick on by default per instructions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProviderLoading, setActiveProviderLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providerNotice, setProviderNotice] = useState<{ provider: string; message: string } | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ isFirst50: boolean; orderNumber: number } | null>(null);

  // Founder Password Security Check State
  const [isFounderStep, setIsFounderStep] = useState(false);
  const [founderPassword, setFounderPassword] = useState('');
  const [founderAttempts, setFounderAttempts] = useState(0);

  if (!isOpen) return null;

  // 1. One-Click Social Authentication (Google, GitHub, Apple)
  const handleSocialAuth = async (provider: 'google' | 'github' | 'apple') => {
    setErrorMessage(null);
    setProviderNotice(null);
    setIsSubmitting(true);
    setActiveProviderLoading(provider);

    try {
      let res;
      if (provider === 'google') {
        res = await loginWithGoogle();
      } else if (provider === 'github') {
        res = await loginWithGithub();
      } else {
        res = await loginWithApple();
      }

      if (!res.success || !res.user) {
        if (res.code === 'auth/operation-not-allowed') {
          setProviderNotice({
            provider: provider === 'github' ? 'GitHub' : 'Apple',
            message: `${provider === 'github' ? 'GitHub' : 'Apple'} Sign-In is not enabled yet in your Firebase project (gen-lang-client-0192116749). You can click "Continue with Google" below for instant 1-click access!`,
          });
        } else if (res.error && !res.error.includes('closed-by-user') && !res.error.includes('popup-closed')) {
          setErrorMessage(res.error);
        }
        setIsSubmitting(false);
        setActiveProviderLoading(null);
        return;
      }

      const authUser = res.user;
      const cleanEmail = (authUser.email || '').toLowerCase().trim();
      const cleanName =
        authUser.displayName?.trim() ||
        (cleanEmail ? cleanEmail.split('@')[0] : 'Heavenly Member');

      // Check if logged in user is Founder Ankush Banerjee
      const isFounder =
        cleanEmail === 'ankushbanerjeecool777@gmail.com' ||
        cleanName.toLowerCase().includes('ankush banerjee');

      // Record to First 50 Can Contest in Firestore ONLY IF NOT FOUNDER
      if (!isFounder) {
        const result = await addSubscriberToFirestore(cleanName, cleanEmail, wantsLimitedCan);
        setSuccessInfo({ isFirst50: result.isFirst50, orderNumber: result.orderNumber });
      }

      // Persist authenticated session
      localStorage.setItem(
        'heavenly_run_user_auth',
        JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          isAdmin: isFounder,
          provider: provider,
          photoURL: authUser.photoURL || null,
          signedAt: new Date().toISOString(),
        })
      );

      setTimeout(() => {
        onSuccess(isFounder, { name: cleanName, email: cleanEmail });
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
      setActiveProviderLoading(null);
    }
  };

  // 2. Direct Email & Name Submission
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 letters).');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check if user is founder Ankush Banerjee
    if (
      cleanEmail.includes('ankushbanerjeecool777') ||
      cleanName.toLowerCase().includes('ankush')
    ) {
      setIsFounderStep(true);
      return;
    }

    // Standard visitor registration flow
    setIsSubmitting(true);
    try {
      const result = await addSubscriberToFirestore(cleanName, cleanEmail, wantsLimitedCan);
      setSuccessInfo({ isFirst50: result.isFirst50, orderNumber: result.orderNumber });

      localStorage.setItem(
        'heavenly_run_user_auth',
        JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          isAdmin: false,
          provider: 'direct',
          signedAt: new Date().toISOString(),
        })
      );

      setTimeout(() => {
        onSuccess(false, { name: cleanName, email: cleanEmail });
      }, 900);
    } catch {
      setErrorMessage('Could not record submission. Please check network connectivity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Founder Password Challenge
  const handleFounderPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict password verification: Ankush@123
    if (founderPassword !== 'Ankush@123') {
      setFounderAttempts((prev) => prev + 1);
      setErrorMessage('Incorrect password. Access denied. Any other password will not work.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanName = 'Ankush Banerjee';
      const cleanEmail = 'ankushbanerjeecool777@gmail.com';

      // Strictly DO NOT add founder to subscriber list; founder is the administrator
      // Save admin session
      localStorage.setItem(
        'heavenly_run_user_auth',
        JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          isAdmin: true,
          provider: 'founder-password',
          signedAt: new Date().toISOString(),
        })
      );

      setSuccessInfo({ isFirst50: false, orderNumber: 0 });

      setTimeout(() => {
        onSuccess(true, { name: cleanName, email: cleanEmail });
      }, 700);
    } catch {
      setErrorMessage('Authentication error during founder verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080E]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      {/* Background glow rings */}
      <div className="absolute w-[520px] h-[520px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full bg-[#0D121F] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto">
        {/* STEP 2: FOUNDER PASSWORD CHALLENGE */}
        {isFounderStep ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-tech tracking-widest uppercase">
                <KeyRound className="w-3.5 h-3.5" />
                <span>FOUNDER IDENTITY DETECTED</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsFounderStep(false);
                  setErrorMessage(null);
                  setFounderPassword('');
                }}
                className="text-xs font-tech text-white/50 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
                WELCOME FOUNDER
              </h2>
              <p className="font-tech text-amber-300 text-sm tracking-wider mt-1 uppercase font-bold">
                PLEASE ENTER PASSWORD TO CONTINUE
              </p>
              <p className="font-tech text-white/50 text-xs mt-2">
                Restricted to founder ID: <span className="text-white font-mono">ankushbanerjeecool777@gmail.com</span>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-tech flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successInfo && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-tech flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Password verified! Unlocking Fifth Page (First 50 Can Roster)...</span>
              </div>
            )}

            <form onSubmit={handleFounderPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                  Founder Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    required
                    value={founderPassword}
                    onChange={(e) => setFounderPassword(e.target.value)}
                    placeholder="Enter founder password"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-500/40 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-amber-400/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-tech font-bold text-sm tracking-widest text-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'CONFIRM FOUNDER PASSWORD'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </form>

            <div className="text-center text-[11px] font-tech text-white/40">
              Only the verified founder password grants access to the First 50 Can Packaging portal.
            </div>
          </div>
        ) : (
          /* STEP 1: INITIAL SIGN IN & FIRST 50 OFFER */
          <div className="space-y-5 animate-fadeIn">
            {/* Top Header Badge & Close Button */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-tech tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL HEAVENLY-RUN ACCESS</span>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Close and explore website directly"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Headline */}
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
                AUTHENTICATE & SIGN IN
              </h2>
              <p className="font-body text-white/70 text-xs sm:text-sm mt-1 leading-relaxed">
                Connect with the HEAVENLY-RUN 3D Experience using Google, GitHub, Apple or Direct Entry.
              </p>
            </div>

            {/* ONE-CLICK AUTH PROVIDERS (Google, GitHub, Apple) */}
            <div className="flex flex-col gap-2.5 pt-1">
              {/* GOOGLE SIGN IN */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-tech font-bold text-xs sm:text-sm tracking-wider transition-all cursor-pointer flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {activeProviderLoading === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>CONTINUE WITH GOOGLE</span>
                <span className="hidden sm:inline-block ml-auto text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  ACTIVE • 1-CLICK
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                {/* GITHUB SIGN IN */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  disabled={isSubmitting}
                  className="py-2.5 px-3 rounded-xl bg-[#24292e] hover:bg-[#2f363d] text-white font-tech font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
                >
                  {activeProviderLoading === 'github' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  )}
                  <span>GITHUB</span>
                </button>

                {/* APPLE SIGN IN */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('apple')}
                  disabled={isSubmitting}
                  className="py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-tech font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15 disabled:opacity-50"
                >
                  {activeProviderLoading === 'apple' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.04-2.85 0-.15-.01-.29-.04-.44-.99.04-2.18.66-2.88 1.48-.55.63-1.04 1.66-1.04 2.73 0 .15.02.31.05.37.11.01.24.03.36.03.9 0 1.89-.57 2.51-1.32z" />
                    </svg>
                  )}
                  <span>APPLE</span>
                </button>
              </div>

              {/* Provider configuration notice if clicked unconfigured provider */}
              {providerNotice && (
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex flex-col gap-2 text-xs font-tech">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span>{providerNotice.provider} Authentication Setup</span>
                    <button
                      type="button"
                      onClick={() => setProviderNotice(null)}
                      className="text-white/40 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-white/70 leading-relaxed font-light text-[11px]">
                    {providerNotice.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('google')}
                    className="self-start px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>Use Google Sign-In (Active & Ready)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* SEPARATOR */}
            <div className="flex items-center gap-3 my-2">
              <div className="h-[1px] bg-white/10 flex-grow" />
              <span className="text-[10px] font-tech text-white/40 uppercase tracking-widest">
                OR REGISTER WITH NAME & EMAIL
              </span>
              <div className="h-[1px] bg-white/10 flex-grow" />
            </div>

            {/* LIMITED EDITION CAN CONTEST CARD */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-blue-950/30 border border-amber-500/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>LIMITED EDITION CAN CONTEST (FIRST 50)</span>
              </div>
              <p className="text-xs font-tech text-white/80 leading-relaxed">
                The <strong>first 50 people</strong> who register get a verified chance to have their full name custom-printed on the inaugural batch of limited edition HEAVENLY-RUN cans.
              </p>

              {/* Tick to choose this offer (Tick is on by default per instructions) */}
              <label className="flex items-start gap-3 mt-1 cursor-pointer bg-black/40 p-2.5 rounded-xl border border-white/10 hover:border-amber-400/40 transition-colors">
                <input
                  type="checkbox"
                  checked={wantsLimitedCan}
                  onChange={(e) => setWantsLimitedCan(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-500 cursor-pointer"
                />
                <div className="text-xs font-tech text-white/90">
                  <span className="font-bold text-amber-300">Count me in for the First 50 Can Name Offer</span>
                  <span className="block text-[11px] text-white/50">
                    (Transmits priority notification to creator Ankush Banerjee)
                  </span>
                </div>
              </label>
            </div>

            {/* Error notification */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-tech flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Success notification */}
            {successInfo && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-tech flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>
                  Entry confirmed! Order #{successInfo.orderNumber}
                  {successInfo.isFirst50 && ' — You are among the First 50 Candidates!'}
                </span>
              </div>
            )}

            {/* Direct Form */}
            <form onSubmit={handleInitialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-tech font-bold text-xs sm:text-sm tracking-widest text-black bg-gradient-to-r from-white via-[#C7CDD5] to-[#A8D8FF] hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'TRANSMITTING ENTRY...' : 'CONFIRM & REGISTER'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </form>

            {/* Optional Skip to explore freely */}
            {onClose && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-tech text-white/50 hover:text-white transition-colors cursor-pointer underline decoration-white/20 underline-offset-4"
                >
                  Explore website directly without registering
                </button>
              </div>
            )}

            <div className="text-center text-[11px] font-tech text-white/40 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Founder Ankush Banerjee enters here for priority verification</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
