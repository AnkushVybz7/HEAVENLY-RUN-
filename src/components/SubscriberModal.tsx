import React, { useState } from 'react';
import { addSubscriberToFirestore, signInWithGoogle, signInWithGithub } from '../services/firebase';
import { Sparkles, Trophy, Check, ShieldCheck, ArrowRight, Lock, AlertTriangle } from 'lucide-react';

interface SubscriberModalProps {
  isOpen: boolean;
  onSuccess: (isAdmin: boolean, userData: { name: string; email: string }) => void;
}

export const SubscriberModal: React.FC<SubscriberModalProps> = ({ isOpen, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wantsLimitedCan, setWantsLimitedCan] = useState(true); // Tick on by default per instructions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ isFirst50: boolean; orderNumber: number } | null>(null);

  if (!isOpen) return null;

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 letters).');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check if user is founder Ankush Banerjee
    if (
      cleanEmail.includes('ankushbanerjeecool777') ||
      cleanName.toLowerCase().includes('ankush')
    ) {
      setErrorMessage('Founder access requires verified Google sign-in. Please use "Sign in with Google" below.');
      return;
    }

    // Standard visitor registration flow
    setIsSubmitting(true);
    try {
      const result = await addSubscriberToFirestore(cleanName, cleanEmail, wantsLimitedCan);
      setSuccessInfo({ isFirst50: result.isFirst50, orderNumber: result.orderNumber });

      setTimeout(() => {
        onSuccess(false, { name: cleanName, email: cleanEmail });
      }, 900);
    } catch {
      setErrorMessage('Could not record submission. Please check network connectivity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGoogle();
      if (res && res.user) {
        const uName = res.user.displayName || 'Google User';
        const uEmail = (res.user.email || '').toLowerCase();

        // Founder access is granted only by verified Google authentication.
        if (uEmail === 'ankushbanerjeecool777@gmail.com' && res.user.emailVerified) {
          onSuccess(true, { name: uName, email: uEmail });
          return;
        }
        if (uEmail === 'ankushbanerjeecool777@gmail.com') {
          setErrorMessage('The founder Google account must have a verified email address.');
          return;
        }

        await addSubscriberToFirestore(uName, uEmail, wantsLimitedCan);
        onSuccess(false, { name: uName, email: uEmail });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google Sign-In canceled or interrupted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGithub();
      if (res && res.user) {
        const uName = res.user.displayName || (res.user as any).reloadUserInfo?.screenName || 'GitHub User';
        const uEmail = (res.user.email || '').toLowerCase();

        // Founder access check
        if (uEmail === 'ankushbanerjeecool777@gmail.com' && res.user.emailVerified) {
          onSuccess(true, { name: uName, email: uEmail });
          return;
        }

        if (uEmail) {
          await addSubscriberToFirestore(uName, uEmail, wantsLimitedCan);
        }
        onSuccess(false, { name: uName, email: uEmail || 'github-user' });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'GitHub Sign-In canceled or interrupted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080E]/95 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Background glow rings */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full bg-[#0D121F] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="space-y-5 animate-fadeIn">
          {/* Top Header Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-tech tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL HEAVENLY-RUN ACCESS</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-tech text-white/50">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>SECURE ACCESS</span>
            </div>
          </div>

          {/* Headline */}
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
              SIGN IN FOR LATEST UPDATES
            </h2>
            <p className="font-body text-white/70 text-sm mt-1.5 leading-relaxed">
              Unlock full access to the HEAVENLY-RUN 3D Experience. Be first in line when production batches and secret drops go live.
            </p>
          </div>

          {/* LIMITED EDITION CAN CONTEST CARD */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-blue-950/30 border border-amber-500/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>LIMITED EDITION CAN CONTEST (FIRST 50)</span>
            </div>
            <p className="text-xs font-tech text-white/80 leading-relaxed">
              Register to express interest in the proposed first-50 limited-can offer. Places, eligibility and any custom-printing offer will be confirmed by the team; registration is not a guarantee.
            </p>

            {/* Tick to choose this offer */}
            <label className="flex items-start gap-3 mt-2 cursor-pointer bg-black/40 p-2.5 rounded-xl border border-white/10 hover:border-amber-400/40 transition-colors">
              <input
                type="checkbox"
                checked={wantsLimitedCan}
                onChange={(e) => setWantsLimitedCan(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-500 cursor-pointer"
              />
              <div className="text-xs font-tech text-white/90">
                <span className="font-bold text-amber-300">Count me in for the First 50 Can Name Offer</span>
                <span className="block text-[11px] text-white/50">
                  (Express interest in the limited-can offer; registration does not guarantee selection.)
                </span>
              </div>
            </label>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-tech flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success notification */}
          {successInfo && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-tech flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Registration received. First-50 positions are confirmed by the team upon verification.</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-tech font-bold text-sm tracking-widest text-black bg-gradient-to-r from-white via-[#C7CDD5] to-[#A8D8FF] hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'TRANSMITTING ENTRY...' : 'CONFIRM & ENTER WEBSITE'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-[1px] bg-white/10 flex-grow" />
            <span className="text-[11px] font-tech text-white/40 uppercase">OR INSTANT AUTHENTICATION</span>
            <div className="h-[1px] bg-white/10 flex-grow" />
          </div>

          {/* Auth Providers Grid: Google & GitHub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-white text-gray-900 font-tech font-bold text-xs tracking-wider hover:bg-gray-100 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Google Sign-In</span>
            </button>

            {/* GitHub Sign-In Button */}
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#24292e] text-white border border-white/20 font-tech font-bold text-xs tracking-wider hover:bg-[#2f363d] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Sign-In</span>
            </button>
          </div>

          <div className="text-center text-[11px] font-tech text-white/40 flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Founder Ankush Banerjee accesses the admin portal via verified Google Sign-In</span>
          </div>
        </div>
      </div>
    </div>
  );
};
