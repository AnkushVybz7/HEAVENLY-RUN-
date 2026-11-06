import React, { useState, useEffect } from 'react';
import { fetchAllSubscribers, clearAllSubscribers, SubscriberDoc } from '../services/firebase';
import { listGoogleForms, createHeavenlyRunForm, GoogleFormItem } from '../services/googleForms';
import { SignUpTrendChart } from '../components/admin/SignUpTrendChart';
import {
  Trophy,
  ShieldCheck,
  Users,
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  FileText,
  Mail,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export const AdminFirst50Page: React.FC = () => {
  const [subscribers, setSubscribers] = useState<SubscriberDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearNotice, setClearNotice] = useState<string | null>(null);

  // Google Forms integration state
  const [formsList, setFormsList] = useState<GoogleFormItem[]>([]);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [formCreateSuccess, setFormCreateSuccess] = useState<string | null>(null);
  const [newFormTitle, setNewFormTitle] = useState('HEAVENLY-RUN — Limited Can 50 Survey');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const subs = await fetchAllSubscribers();
      setSubscribers(subs);
      const forms = await listGoogleForms();
      setFormsList(forms);
    } catch (err) {
      console.warn('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const first50Subscribers = subscribers.filter((s) => s.wantsLimitedCan).slice(0, 50);

  const handleCopyNames = () => {
    const namesList = first50Subscribers
      .map((s, idx) => `${idx + 1}. ${s.name} (${s.email})`)
      .join('\n');
    navigator.clipboard.writeText(namesList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Order,Name,Email,OptedInLimitedCan,Timestamp']
        .concat(
          subscribers.map(
            (s, i) =>
              `${i + 1},"${s.name}","${s.email}",${s.wantsLimitedCan ? 'YES' : 'NO'},"${s.createdAt?.toDate?.().toISOString?.() || ''}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heavenly_run_first_50_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateGoogleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingForm(true);
    setFormCreateSuccess(null);
    try {
      const created = await createHeavenlyRunForm(newFormTitle);
      if (created) {
        setFormCreateSuccess(`Form created successfully! ID: ${created.formId}`);
        const updatedForms = await listGoogleForms();
        setFormsList(updatedForms);
      }
    } catch (err: any) {
      setFormCreateSuccess(`Google Form creation note: Requires active Google OAuth session with Forms scope.`);
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleClearRoster = async () => {
    setIsClearing(true);
    setClearNotice(null);
    try {
      const res = await clearAllSubscribers();
      setSubscribers([]);
      setClearNotice(`First 50 list cleared successfully. Removed ${res.deletedCount} entry/entries. Roster reset to 0 / 50.`);
      setShowClearConfirm(false);
      setTimeout(() => setClearNotice(null), 6000);
    } catch (err: any) {
      setClearNotice(`Error resetting roster: ${err?.message || 'Failed'}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090B12] text-white pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-10">
        {/* Creator Portal Top Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0E1322] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-tech font-bold tracking-[0.2em] uppercase">
                PAGE 5: CREATOR VIP PORTAL
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-tech tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>CONFIDENTIAL FOUNDER VIEW</span>
              </div>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-wide uppercase">
              THE FIRST 50 CAN ROSTER
            </h1>
            <p className="font-body text-white/70 text-sm mt-1">
              Authorized Creator: <strong className="text-amber-300 font-medium">Ankush Banerjee</strong> (<span className="font-tech text-white/80">ankushbanerjeecool777@gmail.com</span>)
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadData}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Refresh Firestore data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleCopyNames}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-tech font-bold text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'NAMES COPIED' : 'COPY FIRST 50 LIST'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-tech font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT CSV</span>
            </button>

            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-red-950/90 border border-red-500/60 rounded-xl px-3 py-1.5 shadow-xl">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-[11px] font-tech text-red-200">Remove all registered entries?</span>
                <button
                  onClick={handleClearRoster}
                  disabled={isClearing}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-tech font-bold cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isClearing ? 'WIPING...' : 'YES, CLEAR ALL'}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-tech cursor-pointer transition-colors"
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-tech font-bold transition-colors flex items-center gap-2 cursor-pointer"
                title="Remove all registered names from First 50 list"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>CLEAR / RESET ROSTER</span>
              </button>
            )}
          </div>
        </div>

        {clearNotice && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs font-tech flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{clearNotice}</span>
            </div>
            <button
              onClick={() => setClearNotice(null)}
              className="text-white/60 hover:text-white text-xs font-tech uppercase"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0c101a] border border-white/10 rounded-2xl p-6">
            <span className="text-xs font-tech text-white/50 uppercase tracking-widest block">
              TOTAL SIGNED SUBSCRIBERS
            </span>
            <div className="text-3xl font-display font-black text-white mt-2">
              {subscribers.length}
            </div>
            <span className="text-xs font-tech text-blue-400 mt-1 block">Live in Firebase Firestore</span>
          </div>

          <div className="bg-[#0c101a] border border-amber-500/30 rounded-2xl p-6">
            <span className="text-xs font-tech text-amber-300 uppercase tracking-widest block">
              LIMITED-CAN INTEREST
            </span>
            <div className="text-3xl font-display font-black text-amber-400 mt-2">
              {first50Subscribers.length} / 50
            </div>
            <span className="text-xs font-tech text-white/60 mt-1 block">
              {50 - first50Subscribers.length > 0
                ? `${50 - first50Subscribers.length} places within the review target (not confirmed)`
                : '50 or more expressions of interest received'}
            </span>
          </div>

          <div className="bg-[#0c101a] border border-white/10 rounded-2xl p-6">
            <span className="text-xs font-tech text-white/50 uppercase tracking-widest block">
              CAN PACKAGING PRINT STATUS
            </span>
            <div className="text-xl font-display font-bold text-emerald-400 mt-2">
              READY FOR PROTOTYPE
            </div>
            <span className="text-xs font-tech text-white/60 mt-1 block">
              Proposed 300 ml concept — not confirmed
            </span>
          </div>
        </div>

        {/* Data Visualization: Sign-up Trend & First 50 Progress Chart */}
        <SignUpTrendChart subscribers={subscribers} />

        {/* First 50 Candidates Table */}
        <div className="bg-[#0E1322] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                EARLIEST LIMITED-CAN INTEREST — REVIEW REQUIRED
              </h2>
            </div>
            <span className="text-xs font-tech text-white/50">
              Showing {first50Subscribers.length} Entries
            </span>
          </div>

          {first50Subscribers.length === 0 ? (
            <div className="p-12 text-center text-white/40 font-tech text-sm bg-black/40 rounded-2xl border border-white/5">
              No registrations are available yet. Entries shown here are expressions of interest, not confirmed winners.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-tech text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-white/50 uppercase">
                    <th className="py-3 px-4">Can Rank</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Contest Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {first50Subscribers.map((sub, index) => (
                    <tr
                      key={sub.id || index}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-amber-400">
                        #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        {sub.name}
                      </td>
                      <td className="py-3.5 px-4 text-white/70">
                        {sub.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          <span>ELIGIBLE FOR CAN</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-white/40">
                        {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleString() : 'Timestamp unavailable'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* GOOGLE FORMS INTEGRATION PANEL (User explicit request) */}
        <div className="bg-[#0E1322] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                  GOOGLE FORMS & WORKSPACE INTEGRATION
                </h2>
                <p className="font-body text-xs text-white/60 mt-0.5">
                  Connected via Google Workspace OAuth for project <span className="font-tech text-blue-300">gen-lang-client-0192116749</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Google Form Section */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-tech text-blue-400 uppercase tracking-wider mb-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>CREATE OFFICIAL FORM</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Generate Google Form
                </h3>
                <p className="font-body text-xs text-white/70 mb-4 leading-relaxed">
                  Use the Google Forms API to spawn an official HEAVENLY-RUN feedback or survey form linked directly to your Google account.
                </p>

                {formCreateSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-950/50 border border-blue-500/40 text-blue-200 text-xs font-tech">
                    {formCreateSuccess}
                  </div>
                )}

                <form onSubmit={handleCreateGoogleForm} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-tech text-white/60 uppercase mb-1">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={newFormTitle}
                      onChange={(e) => setNewFormTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-tech text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingForm}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-tech font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isCreatingForm ? 'CREATING...' : 'CREATE VIA GOOGLE FORMS API'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Existing Google Forms in Drive */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-tech text-white/60 uppercase tracking-wider">
                  LINKED GOOGLE FORMS IN DRIVE ({formsList.length})
                </span>
                <span className="text-[10px] font-tech text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                  OAUTH CONNECTED
                </span>
              </div>

              {formsList.length === 0 ? (
                <div className="p-6 text-center text-xs font-tech text-white/50 border border-dashed border-white/10 rounded-xl">
                  No existing Google Forms detected in Google Drive yet, or sign in to refresh. Create your first form using the left panel!
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formsList.map((form) => (
                    <div
                      key={form.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-tech"
                    >
                      <div>
                        <span className="font-bold text-white block">{form.name}</span>
                        <span className="text-[10px] text-white/40">ID: {form.id}</span>
                      </div>
                      {form.webViewLink && (
                        <a
                          href={form.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
