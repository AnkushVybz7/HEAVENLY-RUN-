import React, { useState } from 'react';
import { FAQ_DATA, FaqItem } from '../data/faq';
import { ContactSubmission } from '../types';
import { addContactInquiryToFirestore } from '../services/firebase';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Lock,
} from 'lucide-react';
import { EmailOtpVerifier } from '../components/EmailOtpVerifier';
import { InstagramSection } from '../components/InstagramSection';
import { submitVerifiedForm } from '../services/otpClient';
import { MotionAccessibilityCard } from '../components/MotionAccessibilityCard';

export const FaqPage: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1); // Open first question by default
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'launch' | 'product' | 'taste' | 'mystery'>('all');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // 6-Digit Email OTP Verification State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<ContactSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('heavenly_run_contact_inquiries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Identity verification check
    if (!isEmailVerified || !verificationToken) {
      setFormError('Please verify your email address with the 6-digit verification code before submitting your inquiry.');
      return;
    }

    // Validation
    if (!contactName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!contactSubject.trim()) {
      setFormError('Please specify the subject of your question.');
      return;
    }
    if (!contactMessage.trim() || contactMessage.trim().length < 10) {
      setFormError('Please provide a descriptive message (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    const newInquiry: ContactSubmission = {
      id: 'msg-' + Date.now(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: contactName.trim(),
      email: contactEmail.trim().toLowerCase(),
      subject: contactSubject.trim(),
      message: contactMessage.trim(),
    };

    try {
      // Validate single-use verification token with backend
      const verifyRes = await submitVerifiedForm({
        email: contactEmail.trim().toLowerCase(),
        verificationToken,
        purpose: 'contact-inquiry',
        formData: newInquiry,
      });

      if (!verifyRes.success) {
        setFormError(verifyRes.error || 'Verification expired or invalid. Please verify email again.');
        setIsEmailVerified(false);
        setVerificationToken('');
        setIsSubmitting(false);
        return;
      }

      const updated = [newInquiry, ...recentInquiries];
      setRecentInquiries(updated);
      localStorage.setItem('heavenly_run_contact_inquiries', JSON.stringify(updated));

      // Persist to Firebase Firestore
      await addContactInquiryToFirestore({
        name: newInquiry.name,
        email: newInquiry.email,
        subject: newInquiry.subject,
        message: newInquiry.message,
      });

      // Reset Form
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setIsEmailVerified(false);
      setVerificationToken('');

      setFormSuccess('THANK YOU. YOUR INQUIRY HAS BEEN LOGGED IN THE HEAVENLY-RUN INBOX.');
    } catch {
      setFormError('Submission failed due to local storage limitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090B12] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-24 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-[11px] font-tech font-bold tracking-[0.2em] text-blue-300 uppercase">
              PAGE 4 OF 4: FAQ & CONTACT
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-tech tracking-[0.25em] text-blue-400 uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>KNOWLEDGE BASE</span>
            </span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl tracking-wide uppercase text-white">
            FREQUENTLY ASKED QUESTIONS
          </h1>

          <p className="font-body text-white/60 text-base sm:text-lg mt-4 leading-relaxed font-light">
            Verified answers regarding our upcoming brand launch, flavour chemistry, can specifications, and official timeline.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-tech text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center w-full sm:w-auto">
            {(
              [
                { label: 'ALL', id: 'all' },
                { label: 'PRODUCT', id: 'product' },
                { label: 'TASTE', id: 'taste' },
                { label: 'LAUNCH', id: 'launch' },
                { label: 'MYSTERY', id: 'mystery' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Reduced Motion & Device Display Telemetry Controller */}
        <MotionAccessibilityCard />

        {/* 10 ACCORDION FAQ ITEMS */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-[#101524] border-blue-500/40 shadow-xl shadow-blue-950/30'
                      : 'bg-[#0b0e17] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-tech text-xs text-blue-400 font-bold shrink-0">
                        {faq.id < 10 ? `0${faq.id}` : faq.id}.
                      </span>
                      <h2 className="font-display font-bold text-base sm:text-lg text-white">
                        {faq.question}
                      </h2>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm sm:text-base font-body text-white/80 leading-relaxed border-t border-white/5">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-white/50 font-tech text-sm bg-white/5 rounded-2xl">
              No matching questions found for "{searchQuery}". Try a different keyword or contact us below.
            </div>
          )}
        </div>

        {/* STILL HAVE QUESTIONS? WE'RE LISTENING. CONTACT FORM (Prompt requirement) */}
        <section className="bg-gradient-to-b from-[#111728] to-[#0A0D16] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl mt-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-tech tracking-widest uppercase mb-3">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DIRECT LINE</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-wider text-white uppercase">
                STILL HAVE QUESTIONS? WE'RE LISTENING.
              </h2>
              <p className="font-body text-white/70 text-sm sm:text-base mt-2">
                Have an inquiry about partnerships, media, or product specifics? Send your message directly to our coordination desk.
              </p>
            </div>

            {/* Notification messages */}
            {formSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-sm font-tech flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold">{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm font-tech flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Distribution inquiry, formula question, media request"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your message in detail here..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* 6-DIGIT EMAIL OTP VERIFICATION SECTION */}
              <div className="pt-2">
                <EmailOtpVerifier
                  email={contactEmail}
                  onEmailChange={setContactEmail}
                  purpose="contact-inquiry"
                  isVerified={isEmailVerified}
                  onVerified={(verifiedEmail, token) => {
                    setContactEmail(verifiedEmail);
                    setIsEmailVerified(true);
                    setVerificationToken(token);
                    setFormError(null);
                  }}
                  disabled={isSubmitting}
                />
              </div>

              <div className="text-[11px] font-tech text-white/40 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Prototype submission mode active. Messages are logged securely in local storage and acknowledged truthfully.
                </span>
              </div>

              {/* Submit Button (Gated by Email Verification) */}
              <button
                type="submit"
                disabled={!isEmailVerified || isSubmitting}
                className={`w-full py-4 rounded-xl font-tech font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${
                  isEmailVerified && !isSubmitting
                    ? 'text-black bg-gradient-to-r from-white via-[#C7CDD5] to-[#A8D8FF] hover:brightness-110 active:scale-98 cursor-pointer shadow-blue-500/20'
                    : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed opacity-60'
                }`}
              >
                {isSubmitting ? (
                  <span>TRANSMITTING MESSAGE...</span>
                ) : !isEmailVerified ? (
                  <>
                    <Lock className="w-4 h-4 text-white/40" />
                    <span>VERIFY EMAIL WITH 6-DIGIT CODE TO SUBMIT</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>TRANSMIT MESSAGE (VERIFIED)</span>
                  </>
                )}
              </button>
            </form>

            {/* Recent inquiries display */}
            {recentInquiries.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="text-xs font-tech text-white/50 uppercase tracking-widest block mb-3">
                  YOUR LOGGED INQUIRIES ({recentInquiries.length})
                </span>
                <div className="space-y-2">
                  {recentInquiries.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-tech flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white">{item.subject}</span>
                        <span className="text-white/40 ml-2">by {item.name}</span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                        LOGGED {item.createdAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dedicated Promotional Instagram Section */}
        <InstagramSection />
      </div>
    </div>
  );
};
