import React, { useState, useEffect } from 'react';
import { FlavourId, FlavourLabSubmission } from '../types';
import { PRODUCTS, BRAND_NAME, CAFFEINE_WARNING } from '../data/products';
import { CanViewer3D } from '../components/3d/CanViewer3D';
import { addFlavourSubmissionToFirestore } from '../services/firebase';
import {
  Sparkles,
  Flame,
  Droplets,
  Layers,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  ThumbsUp,
  Image as ImageIcon,
  Shield,
  Layers3,
} from 'lucide-react';

export const FlavoursPage: React.FC = () => {
  const [selectedFlavour, setSelectedFlavour] = useState<FlavourId>('devil-rush');
  const [viewMode, setViewMode] = useState<'3d' | 'poster'>('3d');

  // Community Flavour Lab State
  const [formName, setFormName] = useState('');
  const [formFlavourName, setFormFlavourName] = useState('');
  const [formCategory, setFormCategory] = useState<FlavourLabSubmission['category']>('sweet and sour');
  const [formDescription, setFormDescription] = useState('');
  const [formColors, setFormColors] = useState('');
  const [formIdeas, setFormIdeas] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FlavourLabSubmission[]>([]);

  // Show only submissions made in this browser session; public submissions are private in Firestore.

  const handleFlavourFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!formFlavourName.trim()) {
      setFormError('Please enter a suggested flavour name.');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Please provide a short flavour description.');
      return;
    }
    if (!formColors.trim()) {
      setFormError('Please suggest can colours for your concept.');
      return;
    }

    const newSubmission: FlavourLabSubmission = {
      id: 'sub-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      name: formName.trim() || 'Anonymous Innovator',
      flavourName: formFlavourName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      suggestedColors: formColors.trim(),
      additionalIdeas: formIdeas.trim(),
    };

    try {
      // Persist to Firebase before displaying a success state.
      await addFlavourSubmissionToFirestore({
        name: newSubmission.name,
        flavourName: newSubmission.flavourName,
        category: newSubmission.category,
        description: newSubmission.description,
        suggestedColors: newSubmission.suggestedColors,
        additionalIdeas: newSubmission.additionalIdeas,
      });
      setSubmissions((previous) => [newSubmission, ...previous]);

      // Reset form
      setFormFlavourName('');
      setFormDescription('');
      setFormColors('');
      setFormIdeas('');
      setFormName('');

      // Exact prompt success message
      setFormSuccess('YOUR IDEA HAS ENTERED THE FLAVOUR LAB.');
    } catch {
      setFormError('Submission failed. Please check your network connection.');
    }
  };

  const product = PRODUCTS[selectedFlavour];
  const isDevil = selectedFlavour === 'devil-rush';

  return (
    <div className="relative min-h-screen bg-transparent text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambience */}
      <div
        className={`absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isDevil ? 'bg-red-900/15' : 'bg-blue-900/15'
        }`}
      />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-[11px] font-tech font-bold tracking-[0.2em] text-blue-300 uppercase">
              PAGE 2 OF 4: FLAVOURS 3D LAB
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-tech tracking-[0.2em] text-white/70 uppercase">
              <Layers3 className="w-3 h-3 text-blue-400" />
              <span>OFFICIAL 3D SHOWROOM</span>
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-[0.08em] uppercase text-white">
            FIND YOUR FREQUENCY.
          </h1>
          <p className="font-body text-white/60 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Experience the dual pillars of HEAVENLY-RUN. Inspect the precision-engineered 300 ML aluminium cans in full real-time 3D or explore the verified sensory profiles.
          </p>

          {/* Quick Flavour Selector Tabs */}
          <div className="inline-flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/15 mt-8 shadow-2xl">
            <button
              onClick={() => setSelectedFlavour('devil-rush')}
              className={`px-6 py-3 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wider transition-all cursor-pointer flex items-center gap-2.5 ${
                isDevil
                  ? 'bg-gradient-to-r from-[#B51227] to-[#7A0C1A] text-white shadow-xl shadow-red-950/60'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-red-300" />
              <span>DEVIL RUSH</span>
            </button>
            <button
              onClick={() => setSelectedFlavour('heavenly-rush')}
              className={`px-6 py-3 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wider transition-all cursor-pointer flex items-center gap-2.5 ${
                !isDevil
                  ? 'bg-gradient-to-r from-[#176BFF] to-[#0D4EB8] text-white shadow-xl shadow-blue-950/60'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Droplets className="w-4 h-4 text-blue-300" />
              <span>HEAVENLY RUSH</span>
            </button>
          </div>
        </div>

        {/* 3D SHOWROOM & PRODUCT PROFILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Can Viewer or Official Poster */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-xs font-tech text-white/70">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.primaryColor }} />
                <span className="font-bold text-white uppercase tracking-wider">{product.name}</span>
                <span className="text-white/30">•</span>
                <span className="text-white/50">{viewMode === '3d' ? 'INTERACTIVE 3D MODEL' : 'OFFICIAL 2.5D POSTER'}</span>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1 rounded text-xs font-tech transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === '3d' ? 'bg-white/20 text-white font-bold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D CAN</span>
                </button>
                <button
                  onClick={() => setViewMode('poster')}
                  className={`px-3 py-1 rounded text-xs font-tech transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'poster' ? 'bg-white/20 text-white font-bold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>OFFICIAL AD</span>
                </button>
              </div>
            </div>

            {/* Display Component */}
            {viewMode === '3d' ? (
              <CanViewer3D
                initialFlavour={selectedFlavour}
                onFlavourChange={(flav) => setSelectedFlavour(flav)}
              />
            ) : (
              <div className="relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center p-4">
                <img
                  src={product.imageAdUrl}
                  alt={`${product.name} Official Advertisement`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center justify-between text-xs font-tech">
                  <span className="text-white/70">Official Ad Artwork Reference</span>
                  <button
                    onClick={() => setViewMode('3d')}
                    className="text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    Switch back to 3D Orbit →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Flavour Profile, Taste Journey & Specs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Flavour Overview Card */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 bg-[#0c101a] ${
                isDevil ? 'border-red-500/30' : 'border-blue-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-tech font-bold uppercase tracking-widest border"
                  style={{
                    backgroundColor: `${product.primaryColor}15`,
                    borderColor: `${product.primaryColor}40`,
                    color: isDevil ? '#FF7A8A' : '#7AB3FF',
                  }}
                >
                  {product.category}
                </span>
                <span className="text-xs font-tech text-white/50 tracking-wider">
                  {product.theme}
                </span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
                {product.name}
              </h2>
              <div
                className="font-tech font-bold text-sm tracking-[0.2em] mt-1 mb-4"
                style={{ color: product.primaryColor }}
              >
                {product.slogan}
              </div>

              <p className="font-body text-white/70 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Taste Experience Breakdown (Prompt exact specifications) */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-display text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
                  TASTE EXPERIENCE TIMELINE
                </h3>

                <div className="space-y-4">
                  {/* First Phase */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center font-tech font-bold text-xs text-black shrink-0 mt-0.5"
                      style={{ backgroundColor: isDevil ? '#FF6B7D' : '#A8D8FF' }}
                    >
                      1
                    </div>
                    <div>
                      <div className="text-xs font-tech font-bold text-white uppercase tracking-wider">
                        FIRST CONTACT
                      </div>
                      <div className="text-sm font-body text-white/80 mt-0.5">
                        {product.tasteExperience.first}
                      </div>
                    </div>
                  </div>

                  {/* Middle Phase */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center font-tech font-bold text-xs text-black shrink-0 mt-0.5"
                      style={{ backgroundColor: '#C7CDD5' }}
                    >
                      2
                    </div>
                    <div>
                      <div className="text-xs font-tech font-bold text-white uppercase tracking-wider">
                        MIDDLE PALATE
                      </div>
                      <div className="text-sm font-body text-white/80 mt-0.5">
                        {product.tasteExperience.middle}
                      </div>
                    </div>
                  </div>

                  {/* Finish Phase */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center font-tech font-bold text-xs text-white shrink-0 mt-0.5"
                      style={{ backgroundColor: product.primaryColor }}
                    >
                      3
                    </div>
                    <div>
                      <div className="text-xs font-tech font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>THE FINISH</span>
                        {product.tasteExperience.spicyKick ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-normal">
                            WARMING FIRE
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-normal">
                            CLEAN REFRESHMENT
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-body text-white/80 mt-0.5">
                        {product.tasteExperience.finish}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proposed Specifications Matrix */}
              <div className="border-t border-white/10 pt-6 mt-6">
                <h3 className="font-display text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
                  PROPOSED FORMULA SPECIFICATIONS
                </h3>

                <div className="grid grid-cols-2 gap-3 font-tech text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 block text-[10px] uppercase">CAN CAPACITY</span>
                    <span className="font-bold text-white text-sm">{product.specifications.volume}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 block text-[10px] uppercase">CAFFEINE MATRIX</span>
                    <span className="font-bold text-white text-sm">{product.specifications.caffeine}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 block text-[10px] uppercase">SUGAR CONTENT</span>
                    <span className="font-bold text-emerald-400 text-sm">{product.specifications.sugar}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-white/40 block text-[10px] uppercase">ENERGY METRICS</span>
                    <span className="font-bold text-emerald-400 text-sm">{product.specifications.calories}</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-tech text-amber-300/80 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>{product.specifications.provisionalNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MORE FLAVOURS SECTION (Exact prompt requirement: "THIS IS ONLY THE BEGINNING. MORE FLAVOURS COMING SOON.") */}
        <section className="pt-12 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-wider text-white">
              THIS IS ONLY THE BEGINNING.
            </h2>
            <p className="font-tech text-sm tracking-[0.25em] text-blue-400 mt-2 uppercase">
              MORE FLAVOURS COMING SOON.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Released Flavour 1 Card */}
            <div className="bg-[#0b0e17] border border-red-500/30 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-tech text-red-400 uppercase tracking-widest">
                  SLOT 01 • FLAGSHIP
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-1">DEVIL RUSH</h3>
                <p className="font-tech text-xs text-white/50 mt-1">Spicy & Sour • Crimson / Black</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-tech text-red-300 border-t border-white/5 pt-4">
                <span>STATUS: READY</span>
                <button
                  onClick={() => setSelectedFlavour('devil-rush')}
                  className="hover:underline cursor-pointer font-bold"
                >
                  VIEW IN 3D →
                </button>
              </div>
            </div>

            {/* Released Flavour 2 Card */}
            <div className="bg-[#0b0e17] border border-blue-500/30 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-tech text-blue-400 uppercase tracking-widest">
                  SLOT 02 • FLAGSHIP
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-1">HEAVENLY RUSH</h3>
                <p className="font-tech text-xs text-white/50 mt-1">Sweet & Sour • Icy Blue / Pearl White</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-tech text-blue-300 border-t border-white/5 pt-4">
                <span>STATUS: READY</span>
                <button
                  onClick={() => setSelectedFlavour('heavenly-rush')}
                  className="hover:underline cursor-pointer font-bold"
                >
                  VIEW IN 3D →
                </button>
              </div>
            </div>

            {/* Mysterious Empty Product Slot (Prompt Requirement) */}
            <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-tech text-purple-400 uppercase tracking-widest">
                SLOT 03 • LAB PROTOCOL
              </span>
              <h3 className="font-display font-bold text-lg text-white/80 mt-1">
                CLASSIFIED EXPERIMENT
              </h3>
              <p className="text-xs font-tech text-white/50 mt-1">
                Currently formulating in the Community Flavour Lab.
              </p>
            </div>
          </div>
        </section>

        {/* COMMUNITY FLAVOUR LAB (Exact prompt requirement) */}
        <section className="bg-gradient-to-b from-[#101524] to-[#0A0D16] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-tech tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMMUNITY LAB</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wider text-white">
                WHAT SHOULD WE CREATE NEXT?
              </h2>
              <p className="font-body text-white/70 text-sm sm:text-base mt-3">
                Have a radical concept for our next 300 ML can? Propose taste structures, sensory categories, and can finishes directly to our product R&D team.
              </p>
            </div>

            {/* Notification Messages */}
            {formSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-sm font-tech flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold tracking-wider">{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm font-tech flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleFlavourFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name (Optional) */}
                <div>
                  <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Elena V. or CyberAesthetic"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Suggested Flavour Name */}
                <div>
                  <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                    Suggested Flavour Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formFlavourName}
                    onChange={(e) => setFormFlavourName(e.target.value)}
                    placeholder="e.g. COSMIC THUNDER, NEON ACID"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Flavour Category */}
              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                  Flavour Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    ['sweet', 'sour', 'sweet and sour', 'spicy', 'fruity', 'citrus', 'other'] as const
                  ).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-tech font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        formCategory === cat
                          ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavour Description */}
              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                  Flavour Description & Tasting Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the initial hit, middle body, and finish sensation (e.g. tart passionfruit with sharp lime burst)..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Suggested Can Colours */}
              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                  Suggested Can Colours & Materials *
                </label>
                <input
                  type="text"
                  required
                  value={formColors}
                  onChange={(e) => setFormColors(e.target.value)}
                  placeholder="e.g. Holographic purple, matte obsidian black, anodized titanium"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Additional Ideas (Optional) */}
              <div>
                <label className="block text-xs font-tech text-white/70 uppercase tracking-wider mb-2">
                  Additional Ideas or Packaging Concepts (Optional)
                </label>
                <input
                  type="text"
                  value={formIdeas}
                  onChange={(e) => setFormIdeas(e.target.value)}
                  placeholder="e.g. UV blacklight reactive typography, textured grip"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-sm font-tech focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Privacy Notice & Prototype storage disclaimer */}
              <div className="flex items-start gap-2 text-xs font-tech text-white/40">
                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <span>
                  <strong>Privacy Notice:</strong> Ideas are submitted to the configured Firebase project and can be reviewed by the authorised administrator. Avoid including sensitive personal information.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-tech font-bold text-sm tracking-widest text-black bg-gradient-to-r from-white via-blue-100 to-[#A8D8FF] hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
                <span>SUBMIT TO FLAVOUR LAB</span>
              </button>
            </form>

            {/* Display of Recent Community Ideas */}
            {submissions.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-sm font-bold tracking-wider uppercase text-white/60">
                    YOUR RECENT SESSION SUBMISSIONS ({submissions.length})
                  </h3>
                  <span className="text-[10px] font-tech text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20">
                    THIS BROWSER SESSION
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {submissions.slice(0, 4).map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-display font-bold text-base text-white">
                            {sub.flavourName}
                          </span>
                          <span className="text-[10px] font-tech uppercase px-2 py-0.5 rounded bg-white/10 text-blue-300">
                            {sub.category}
                          </span>
                        </div>
                        <p className="text-xs font-body text-white/70 line-clamp-2 mt-1">
                          {sub.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-tech text-white/40">
                        <span>Colours: {sub.suggestedColors}</span>
                        <span>by {sub.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
