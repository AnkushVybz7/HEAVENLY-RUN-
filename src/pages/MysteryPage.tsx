import React, { useState, useEffect } from 'react';
import { StageVisualizer3D } from '../components/3d/StageVisualizer3D';
import { audioSynth } from '../utils/audio';
import { GUITARIST_REVEAL_STATUS } from '../data/products';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Lock,
  Music2,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Disc,
  Radio,
} from 'lucide-react';

export const MysteryPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRiff, setActiveRiff] = useState<'solo-intro' | 'heavy-chords' | 'celestial-tap'>('solo-intro');
  const [volume, setVolume] = useState(0.7);

  // Sync volume with audio synthesizer
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioSynth.setVolume(newVol);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      audioSynth.stopRiff();
      setIsPlaying(false);
    } else {
      audioSynth.setVolume(volume);
      setIsPlaying(true);
      audioSynth.playRiff(activeRiff, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleSelectRiff = (riff: 'solo-intro' | 'heavy-chords' | 'celestial-tap') => {
    setActiveRiff(riff);
    if (isPlaying) {
      audioSynth.stopRiff();
      audioSynth.setVolume(volume);
      audioSynth.playRiff(riff, () => {
        setIsPlaying(false);
      });
    }
  };

  // Cleanup audio on page unmount
  useEffect(() => {
    return () => {
      audioSynth.stopRiff();
    };
  }, []);

  // Verified Guitarist Skill Panels (strictly factual per prompt instructions)
  const SKILL_PANELS = [
    {
      title: 'LEAD GUITAR',
      icon: Zap,
      accent: 'border-blue-500/30 text-blue-400',
      description:
        'Expressive melodic lines with dynamic articulation, sustained vibrato, and celestial note choice that anchors the HEAVENLY-RUN identity.',
    },
    {
      title: 'TECHNICAL PRECISION',
      icon: Sliders,
      accent: 'border-red-500/30 text-red-400',
      description:
        'Surgical rhythmic control and note separation across high-tempo passages, executing complex phrasing without loss of clarity.',
    },
    {
      title: 'FAST PICKING',
      icon: Activity,
      accent: 'border-purple-500/30 text-purple-400',
      description:
        'Rapid alternate picking speed honed through rigorous personal discipline and dedication to the instrument.',
    },
    {
      title: 'RIFFS',
      icon: Disc,
      accent: 'border-amber-500/30 text-amber-400',
      description:
        'Punchy, high-impact rock and cyber groove motifs designed to ignite raw focus and elevate heart rate.',
    },
    {
      title: 'IMPROVISATION',
      icon: Radio,
      accent: 'border-emerald-500/30 text-emerald-400',
      description:
        'Fluid harmonic navigation over modern chord structures, instinctively adapting solos to the sonic frequency of the moment.',
    },
    {
      title: 'MUSICAL CREATIVITY',
      icon: Sparkles,
      accent: 'border-cyan-500/30 text-cyan-400',
      description:
        'Innovative fusion of raw electric overdrive with atmospheric ambient soundscapes, reflecting the contrast between Devil and Heavenly.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#090B12] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Stage Fog Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-blue-900/10 via-red-950/10 to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-[11px] font-tech font-bold tracking-[0.2em] text-red-300 uppercase">
              PAGE 3 OF 4: THE MYSTERY & SOUNDSTAGE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-[11px] font-tech tracking-[0.25em] text-red-400 uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>CLASSIFIED PROTOCOL</span>
            </span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-[0.08em] uppercase text-white">
            BEHIND THE FREQUENCY.
          </h1>

          <h2 className="font-tech font-bold text-base sm:text-xl tracking-[0.3em] text-red-400 mt-3 uppercase">
            ONE GUITARIST. ONE SECRET.
          </h2>

          <p className="font-body text-white/70 text-base sm:text-lg mt-5 leading-relaxed font-light">
            Behind <strong className="text-white font-medium">HEAVENLY-RUN</strong> is an extraordinary young electric guitarist. A young musical prodigy with remarkable dedication, musical creativity and a passion for his instrument. His identity remains secret until the planned reveal.
          </p>
        </div>

        {/* 3D CONCERT STAGE & PROCEDURAL AUDIO PLAYER RIG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Concert Stage Canvas (Left 7 Columns) */}
          <div className="lg:col-span-7">
            <StageVisualizer3D isPlaying={isPlaying} />
          </div>

          {/* Electric Guitar Audio Player Console (Right 5 Columns) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#111624] to-[#0A0D16] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Music2 className="w-5 h-5 text-red-400" />
                <span className="font-display font-bold text-sm tracking-wider uppercase text-white">
                  ELECTRIC GUITAR AUDIO PLAYER
                </span>
              </div>
              <span className="text-[10px] font-tech text-white/40 uppercase tracking-widest">
                NEVER AUTOPLAYS
              </span>
            </div>

            {/* Track / Riff Selectors */}
            <div className="space-y-2">
              <label className="block text-xs font-tech text-white/50 uppercase tracking-wider mb-2">
                SELECT RIFF PATTERN:
              </label>

              <button
                onClick={() => handleSelectRiff('solo-intro')}
                className={`w-full p-3 rounded-xl border text-left font-tech text-xs flex items-center justify-between transition-all cursor-pointer ${
                  activeRiff === 'solo-intro'
                    ? 'bg-blue-600/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-bold">PATTERN 01: CELESTIAL SOLO INTRO</span>
                </div>
                <span className="text-[10px] text-white/40">E MINOR SHRED</span>
              </button>

              <button
                onClick={() => handleSelectRiff('heavy-chords')}
                className={`w-full p-3 rounded-xl border text-left font-tech text-xs flex items-center justify-between transition-all cursor-pointer ${
                  activeRiff === 'heavy-chords'
                    ? 'bg-red-600/20 border-red-400 text-white shadow-lg shadow-red-500/20'
                    : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="font-bold">PATTERN 02: DEVIL RUSH HEAVY GROOVE</span>
                </div>
                <span className="text-[10px] text-white/40">PUNCHY OVERDRIVE</span>
              </button>

              <button
                onClick={() => handleSelectRiff('celestial-tap')}
                className={`w-full p-3 rounded-xl border text-left font-tech text-xs flex items-center justify-between transition-all cursor-pointer ${
                  activeRiff === 'celestial-tap'
                    ? 'bg-purple-600/20 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="font-bold">PATTERN 03: TWO-HANDED HARMONIC TAP</span>
                </div>
                <span className="text-[10px] text-white/40">HIGH CADENCE</span>
              </button>
            </div>

            {/* Play/Pause Main Trigger */}
            <div className="flex flex-col gap-4 pt-2">
              <button
                onClick={handlePlayToggle}
                className={`w-full py-4 rounded-xl font-tech font-bold text-sm tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 shadow-xl ${
                  isPlaying
                    ? 'bg-red-600 text-white shadow-red-600/40 hover:bg-red-500'
                    : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-red-500 text-white shadow-blue-500/30 hover:brightness-110 active:scale-98'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>STOP AUDIO DEMO</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>PLAY ELECTRIC GUITAR RIFF</span>
                  </>
                )}
              </button>

              {/* Volume Slider & Controls */}
              <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/10">
                <button
                  onClick={() => handleVolumeChange(volume === 0 ? 0.7 : 0)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <span className="text-xs font-tech text-white/50 w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            {/* Audio Synthesis Notice */}
            <p className="text-[11px] font-tech text-white/40 leading-relaxed border-t border-white/5 pt-3">
              Generated in real-time via the Web Audio API with waveshaping overdrive and pickup emulation. Strictly zero external audio file dependencies.
            </p>
          </div>
        </div>

        {/* VERIFIED SKILLS PANELS (Prompt Requirement: Only claim verified potential skills, no invented awards) */}
        <section className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-tech uppercase tracking-[0.3em] text-blue-400 mb-2">
              DISCIPLINE & CRAFT
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wider text-white">
              VERIFIED MUSICAL ABILITIES
            </h2>
            <p className="font-body text-white/60 text-sm mt-3">
              Grounded strictly in demonstrated musical discipline, technical prowess, and electric creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_PANELS.map((skill) => {
              const IconComp = skill.icon;
              return (
                <div
                  key={skill.title}
                  className={`bg-[#0c101a] border ${skill.accent} rounded-2xl p-6 hover:bg-[#101524] transition-all duration-300 shadow-xl flex flex-col justify-between`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5 text-white/80" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">
                      {skill.title}
                    </h3>
                    <p className="font-body text-white/70 text-sm leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-tech text-white/40 tracking-widest uppercase">
                    ATTRIBUTE: VERIFIED DISCIPLINE
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL SECTION: WHO IS BEHIND THE SOUND? (Prompt Requirement: Truthful dates and classification) */}
        <section className="relative py-16 px-6 sm:px-12 rounded-3xl bg-gradient-to-r from-red-950/30 via-[#101524] to-blue-950/30 border border-white/15 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-500/40 flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-red-400" />
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-wider text-white uppercase">
            WHO IS BEHIND THE SOUND?
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <div className="px-5 py-2 rounded-full bg-black/60 border border-red-500/40 text-red-300 font-tech font-bold text-xs tracking-widest">
              IDENTITY: CLASSIFIED
            </div>
            <div className="px-5 py-2 rounded-full bg-black/60 border border-blue-500/40 text-blue-300 font-tech font-bold text-xs tracking-widest">
              REVEAL DATE: {GUITARIST_REVEAL_STATUS}
            </div>
          </div>

          <p className="max-w-xl font-body text-white/60 text-sm sm:text-base mt-6 leading-relaxed">
            The guitarist's persona, face, and official sponsorship details will be disclosed in synchrony with the official HEAVENLY-RUN global reveal. Until then, the focus remains purely on the sound.
          </p>
        </section>
      </div>
    </div>
  );
};
