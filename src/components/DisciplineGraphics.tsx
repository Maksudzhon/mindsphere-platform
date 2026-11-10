import React from 'react';

/**
 * Human-Crafted Animated Visual Graphics & Diagrams
 * Authored with scientific, jurisprudential, artistic, and mathematical authenticity.
 */

export const BiologyGraphic: React.FC<{ className?: string; interactive?: boolean }> = ({
  className = 'w-full h-full',
  interactive = false,
}) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} group/bio`}>
    <defs>
      <linearGradient id="bioHelixA" x1="20" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="0.5" stopColor="#10B981" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="bioHelixB" x1="20" y1="160" x2="160" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6EE7B7" />
        <stop offset="0.5" stopColor="#059669" />
        <stop offset="1" stopColor="#064E3B" />
      </linearGradient>
      <radialGradient id="crisprGlow" cx="90" cy="90" r="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" stopOpacity="0.35" />
        <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
      </radialGradient>
      <filter id="bioFilter" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10B981" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Background container with subtle cell membrane contour */}
    <rect width="180" height="180" rx="28" fill="#05140F" />
    <circle cx="90" cy="90" r="70" stroke="#10B981" strokeOpacity="0.12" strokeWidth="1.5" strokeDasharray="3 4" />
    <circle cx="90" cy="90" r="45" fill="url(#crisprGlow)" />

    {/* CRISPR-Cas9 Target Recognition Coordinates */}
    <g className="transition-transform duration-500 group-hover/bio:scale-105 origin-center">
      {/* Base Pair Hydrogen Rungs */}
      {[
        { x: 42, y1: 65, y2: 115 },
        { x: 58, y1: 76, y2: 104 },
        { x: 74, y1: 85, y2: 95 },
        { x: 90, y1: 89, y2: 91 },
        { x: 106, y1: 85, y2: 95 },
        { x: 122, y1: 76, y2: 104 },
        { x: 138, y1: 65, y2: 115 },
      ].map((rung, i) => (
        <line
          key={i}
          x1={rung.x}
          y1={rung.y1}
          x2={rung.x}
          y2={rung.y2}
          stroke="#6EE7B7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
          className="transition-all duration-300 group-hover/bio:stroke-[#A7F3D0]"
        />
      ))}

      {/* Primary DNA Strand Wave (5' to 3') */}
      <path
        d="M25 45 C 50 75, 65 115, 90 90 C 115 65, 130 105, 155 135"
        stroke="url(#bioHelixA)"
        strokeWidth="4.5"
        strokeLinecap="round"
        filter="url(#bioFilter)"
      />

      {/* Complementary DNA Strand Wave (3' to 5') */}
      <path
        d="M25 135 C 50 105, 65 65, 90 90 C 115 115, 130 75, 155 45"
        stroke="url(#bioHelixB)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Cas9 Endonuclease Active Cleavage Core */}
      <circle cx="90" cy="90" r="6" fill="#F59E0B" className="animate-ping" style={{ animationDuration: '3s' }} />
      <circle cx="90" cy="90" r="5" fill="#FBBF24" stroke="#FFF" strokeWidth="1.5" />

      {/* PAM Recognition Motif Badge: 5'-NGG-3' */}
      <rect x="68" y="142" width="44" height="18" rx="6" fill="#062E20" stroke="#10B981" strokeWidth="1" />
      <text x="90" y="154" fill="#6EE7B7" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        5'-NGG-3'
      </text>

      {/* Molecular Nucleotide Labels */}
      <text x="32" y="38" fill="#34D399" fontSize="8" fontFamily="monospace" opacity="0.8">5'</text>
      <text x="148" y="146" fill="#34D399" fontSize="8" fontFamily="monospace" opacity="0.8">3'</text>
    </g>
  </svg>
);

export const LawGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} group/law`}>
    <defs>
      <linearGradient id="lawPillarGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="0.6" stopColor="#3B82F6" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="lawPediment" x1="40" y1="30" x2="140" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>

    {/* Background container */}
    <rect width="180" height="180" rx="28" fill="#081426" />

    {/* Classical Temple Pediment with Latin Inscription: LEX */}
    <path
      d="M36 54 L90 30 L144 54 Z"
      fill="url(#lawPediment)"
      fillOpacity="0.3"
      stroke="#60A5FA"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <text x="90" y="49" fill="#BFDBFE" fontSize="9" fontFamily="serif" fontWeight="bold" letterSpacing="0.1em" textAnchor="middle">
      LEX · IUSTITIA
    </text>

    {/* Corinthian Architecture Fluted Columns */}
    <g stroke="url(#lawPillarGrad)" strokeWidth="3.5" strokeLinecap="round">
      <line x1="46" y1="56" x2="46" y2="124" />
      <line x1="72" y1="56" x2="72" y2="124" />
      <line x1="108" y1="56" x2="108" y2="124" />
      <line x1="134" y1="56" x2="134" y2="124" />
    </g>

    {/* Solid Foundation Plinth */}
    <rect x="32" y="124" width="116" height="10" rx="3" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />

    {/* Dynamic Scales of Justice with Physical Equilibrium Sway */}
    <g className="animate-balance-sway">
      {/* Central Fulcrum Mast */}
      <line x1="90" y1="65" x2="90" y2="115" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="90" cy="74" r="4.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1" />

      {/* Horizontal Crossbeam */}
      <line x1="58" y1="74" x2="122" y2="74" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" />

      {/* Left Pan (Precedent & Fact) */}
      <line x1="58" y1="74" x2="48" y2="96" stroke="#93C5FD" strokeWidth="1.5" />
      <line x1="58" y1="74" x2="68" y2="96" stroke="#93C5FD" strokeWidth="1.5" />
      <path d="M44 96 Q 58 104 72 96" stroke="#60A5FA" strokeWidth="2.5" fill="#1E40AF" fillOpacity="0.4" />

      {/* Right Pan (Constitutional Strict Scrutiny) */}
      <line x1="122" y1="74" x2="112" y2="96" stroke="#93C5FD" strokeWidth="1.5" />
      <line x1="122" y1="74" x2="132" y2="96" stroke="#93C5FD" strokeWidth="1.5" />
      <path d="M108 96 Q 122 104 136 96" stroke="#60A5FA" strokeWidth="2.5" fill="#1E40AF" fillOpacity="0.4" />
    </g>

    {/* Roman Legal Precedent Code */}
    <text x="90" y="146" fill="#60A5FA" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.9">
      ART. III · MARBURY v. MADISON
    </text>
  </svg>
);

export const ArtsGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} group/art`}>
    <defs>
      <linearGradient id="tenebrismRay" x1="20" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF" stopOpacity="0.45" />
        <stop offset="0.6" stopColor="#EC4899" stopOpacity="0.2" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="artPaletteGrad" x1="40" y1="130" x2="140" y2="130" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EC4899" />
        <stop offset="0.5" stopColor="#D946EF" />
        <stop offset="1" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>

    {/* Deep Tenebrism Obsidian Void */}
    <rect width="180" height="180" rx="28" fill="#150814" />

    {/* Directional Caravaggio Chiaroscuro Light Beam */}
    <polygon points="20,20 160,100 120,160 20,40" fill="url(#tenebrismRay)" />

    {/* Bauhaus / Munsell Chromatic Triad (CMY & RGB Synthesis) */}
    <g className="transition-transform duration-700 group-hover/art:rotate-12 origin-center">
      <circle cx="76" cy="74" r="34" fill="#EC4899" fillOpacity="0.45" stroke="#F472B6" strokeWidth="2" />
      <circle cx="104" cy="74" r="34" fill="#8B5CF6" fillOpacity="0.45" stroke="#C084FC" strokeWidth="2" />
      <circle cx="90" cy="102" r="34" fill="#F43F5E" fillOpacity="0.45" stroke="#FB7185" strokeWidth="2" />
    </g>

    {/* Golden Ratio Logarithmic Spiral: Φ = 1.618 */}
    <path
      d="M90 90 A 10 10 0 0 1 100 80 A 20 20 0 0 1 120 100 A 40 40 0 0 1 80 140 A 80 80 0 0 1 20 80"
      stroke="#FBBF24"
      strokeWidth="2"
      strokeOpacity="0.5"
      strokeDasharray="4 3"
      fill="none"
    />

    {/* Impasto Painterly Swatch Ribbon */}
    <path
      d="M38 136 C 70 110, 110 110, 142 136"
      stroke="url(#artPaletteGrad)"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Pure Pigment Dots */}
    <circle cx="50" cy="130" r="4" fill="#F43F5E" stroke="#FFF" strokeWidth="1" />
    <circle cx="90" cy="120" r="4" fill="#FBBF24" stroke="#FFF" strokeWidth="1" />
    <circle cx="130" cy="130" r="4" fill="#38BDF8" stroke="#FFF" strokeWidth="1" />

    <text x="90" y="160" fill="#F472B6" fontSize="8" fontFamily="serif" fontStyle="italic" textAnchor="middle">
      Tenebrismo · Chiaroscuro · Φ = 1.618
    </text>
  </svg>
);

export const MathGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} group/math`}>
    <defs>
      <linearGradient id="mathVectorGrad" x1="90" y1="90" x2="140" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A855F7" />
        <stop offset="1" stopColor="#E879F9" />
      </linearGradient>
    </defs>

    {/* Background container with coordinate grid texture */}
    <rect width="180" height="180" rx="28" fill="#100A20" />

    {/* Coordinate Axes with Tick Marks */}
    <line x1="25" y1="90" x2="155" y2="90" stroke="#4C1D95" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="90" y1="25" x2="90" y2="155" stroke="#4C1D95" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Invariant Transformation Ellipse (Eigenvalue Spectrogram) */}
    <ellipse
      cx="90"
      cy="90"
      rx="55"
      ry="26"
      transform="rotate(-35 90 90)"
      stroke="#8B5CF6"
      strokeWidth="2.5"
      fill="#8B5CF6"
      fillOpacity="0.12"
      className="transition-all duration-500 group-hover/math:stroke-[#C084FC]"
    />

    {/* Orthogonal Vector Projection Lines */}
    <line x1="140" y1="52" x2="140" y2="90" stroke="#7C3AED" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="140" y1="52" x2="90" y2="52" stroke="#7C3AED" strokeWidth="1" strokeDasharray="2 2" />

    {/* Dominant Eigenvector v1 (Scaled by lambda) */}
    <line
      x1="90"
      y1="90"
      x2="140"
      y2="52"
      stroke="url(#mathVectorGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      className="transition-transform duration-300 group-hover/math:translate-x-1 group-hover/math:-translate-y-1"
    />
    <polygon points="140,52 129,56 135,63" fill="#E879F9" />

    {/* Orthogonal Eigenvector v2 */}
    <line x1="90" y1="90" x2="68" y2="60" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
    <polygon points="68,60 72,69 78,64" fill="#60A5FA" />

    {/* The Golden Linear Equation: Av = λv */}
    <rect x="52" y="140" width="76" height="20" rx="6" fill="#1E1338" stroke="#8B5CF6" strokeWidth="1" />
    <text x="90" y="153" fill="#E9D5FF" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      A v = λ v
    </text>

    <text x="146" y="48" fill="#F472B6" fontSize="9" fontFamily="monospace" fontWeight="bold">λv₁</text>
    <text x="56" y="58" fill="#93C5FD" fontSize="8" fontFamily="monospace">v₂</text>
  </svg>
);

export const BusinessGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} group/biz`}>
    <defs>
      <linearGradient id="bizCurveGrad" x1="30" y1="140" x2="150" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316" />
        <stop offset="0.5" stopColor="#FB923C" />
        <stop offset="1" stopColor="#FBBF24" />
      </linearGradient>
      <linearGradient id="bizFillArea" x1="90" y1="40" x2="90" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316" stopOpacity="0.25" />
        <stop offset="1" stopColor="#F97316" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Dark Sienna Obsidian Canvas */}
    <rect width="180" height="180" rx="28" fill="#180C05" />

    {/* Shaded Area Under Metcalfe Network Expansion Curve */}
    <path
      d="M32 136 Q 90 130 148 40 L 148 136 Z"
      fill="url(#bizFillArea)"
    />

    {/* Exponential Network Scale Curve */}
    <path
      d="M32 136 Q 90 130 148 40"
      stroke="url(#bizCurveGrad)"
      strokeWidth="4.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Two-Sided Platform Network Graph Mesh with Animated Packet Flow */}
    <g className="animate-packet-flow">
      <line x1="45" y1="110" x2="75" y2="78" stroke="#F97316" strokeWidth="1.5" />
      <line x1="75" y1="78" x2="115" y2="65" stroke="#F97316" strokeWidth="1.5" />
      <line x1="75" y1="78" x2="92" y2="115" stroke="#F97316" strokeWidth="1.5" />
      <line x1="115" y1="65" x2="148" y2="40" stroke="#FBBF24" strokeWidth="2" />
    </g>

    {/* Liquidity Nodes */}
    <circle cx="45" cy="110" r="5" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
    <circle cx="75" cy="78" r="6.5" fill="#F97316" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="92" cy="115" r="5" fill="#FB923C" stroke="#EA580C" strokeWidth="1.5" />
    <circle cx="115" cy="65" r="6" fill="#FBBF24" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="148" cy="40" r="8" fill="#F59E0B" stroke="#FFF" strokeWidth="2" className="animate-pulse" />

    {/* Metcalfe's Law Metric Indicator: V ∝ n² */}
    <rect x="52" y="144" width="76" height="18" rx="5" fill="#2E1305" stroke="#EA580C" strokeWidth="1" />
    <text x="90" y="156" fill="#FDBA74" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
      V ∝ n² (Metcalfe)
    </text>
  </svg>
);

export const MusicGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} group/mus`}>
    <defs>
      <linearGradient id="musWaveGrad" x1="20" y1="90" x2="160" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06B6D4" />
        <stop offset="0.5" stopColor="#38BDF8" />
        <stop offset="1" stopColor="#67E8F9" />
      </linearGradient>
    </defs>

    {/* Acoustic Dark Slate Canvas */}
    <rect width="180" height="180" rx="28" fill="#041217" />

    {/* Circle of Fifths Concentric Harmonics */}
    <circle cx="90" cy="90" r="58" stroke="#06B6D4" strokeWidth="2.5" strokeOpacity="0.45" strokeDasharray="6 4" />
    <circle cx="90" cy="90" r="38" stroke="#22D3EE" strokeWidth="1.5" strokeOpacity="0.3" />
    <circle cx="90" cy="90" r="10" fill="#0891B2" />

    {/* Fundamental Frequency (f0) Sine Wave */}
    <path
      d="M25 90 Q 55 52 90 90 T 155 90"
      stroke="url(#musWaveGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
      className="transition-all duration-500 group-hover/mus:stroke-[#A5F3FC]"
    />

    {/* First Harmonic Overtone (2f0) Oscillating Counter-Wave */}
    <path
      d="M25 90 Q 42 118 60 90 T 95 90 T 130 90 T 155 90"
      stroke="#06B6D4"
      strokeWidth="2"
      strokeOpacity="0.75"
      strokeLinecap="round"
      fill="none"
    />

    {/* Circle of Fifths Key Signatures */}
    {[
      { key: 'C', x: 90, y: 38 },
      { key: 'G', x: 128, y: 55 },
      { key: 'D', x: 144, y: 94 },
      { key: 'A', x: 128, y: 133 },
      { key: 'E', x: 90, y: 148 },
      { key: 'F', x: 52, y: 55 },
      { key: 'B♭', x: 36, y: 94 },
    ].map((k) => (
      <text
        key={k.key}
        x={k.x}
        y={k.y}
        fill="#A5F3FC"
        fontSize="8"
        fontFamily="sans-serif"
        fontWeight="bold"
        textAnchor="middle"
        className="opacity-80"
      >
        {k.key}
      </text>
    ))}

    {/* Fourier Harmonic Decomposition Badge */}
    <text x="90" y="168" fill="#22D3EE" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.9">
      f₀ · 2f₀ · 3f₀ · Modal Counterpoint
    </text>
  </svg>
);

/**
 * Interactive Discipline Synergy Matrix Graphic
 * Highlights multi-disciplinary innovation when distinct fields intersect
 */
export const DisciplineSynergyMatrix: React.FC<{
  onSelectPair?: (d1: string, d2: string) => void;
}> = ({ onSelectPair }) => {
  const [selectedSynergy, setSelectedSynergy] = React.useState<number>(0);

  const synergies = [
    {
      title: 'Computational Genomics',
      pair: ['Biology', 'Mathematics'],
      color: 'from-emerald-500 to-purple-600',
      desc: 'CRISPR base editing guided by stochastic Markov models and Fourier spectral sequence alignment.',
      impact: 'Personalized genomic medicine & rapid mRNA design',
    },
    {
      title: 'Algorithmic Venture Law',
      pair: ['Law & Justice', 'Business'],
      color: 'from-blue-500 to-orange-500',
      desc: 'Decentralized autonomous covenants, antitrust governance for platforms, and liquid convertible debt structures.',
      impact: 'Next-generation tech governance & sovereign finance',
    },
    {
      title: 'Acoustic Mathematical Physics',
      pair: ['Mathematics', 'Music'],
      color: 'from-purple-500 to-cyan-500',
      desc: 'Harmonic spectral analysis, Fourier transforms in timbre synthesis, and modal frequency resonance.',
      impact: 'Audio DSP algorithms & spatial neuro-acoustics',
    },
    {
      title: 'Visual Property Jurisprudence',
      pair: ['Fine Arts', 'Law & Justice'],
      color: 'from-pink-500 to-blue-500',
      desc: 'Digital provenance, fair use transformative standards in generative aesthetics, and museum repatriation ethics.',
      impact: 'Cultural heritage defensibility & creator economy rights',
    },
    {
      title: 'Bio-Inspired Platform Economics',
      pair: ['Biology', 'Business'],
      color: 'from-emerald-500 to-orange-500',
      desc: 'Symbiotic multi-sided markets mimicking ecosystem mycorrhizal nutrient sharing and natural selection pressures.',
      impact: 'Resilient circular economies & zero-waste supply chains',
    },
  ];

  const active = synergies[selectedSynergy];

  return (
    <div className="bg-[#0F162A] border border-[#1E2942] rounded-2xl p-5 md:p-6 space-y-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A253E]">
        <div>
          <h3 className="text-base md:text-lg font-bold text-white font-display flex items-center gap-2">
            <span>Polymath Synergy Matrix</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              Cross-Disciplinary
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover breakthroughs created when you study multiple domains together
          </p>
        </div>

        {/* Tab picker for 5 synergies */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {synergies.map((s, idx) => (
            <button
              key={s.title}
              onClick={() => setSelectedSynergy(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSynergy === idx
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#141C34] text-slate-400 hover:text-white hover:bg-[#1A2648]'
              }`}
            >
              {s.pair[0]} + {s.pair[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Synergy Highlight Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#121A33] to-[#151735] border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-display">{active.title}</span>
            <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
              {active.pair[0]} ⟷ {active.pair[1]}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{active.desc}</p>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-0.5">
            <span>Outcome:</span>
            <span className="text-slate-300 font-normal">{active.impact}</span>
          </div>
        </div>

        <button
          onClick={() => onSelectPair && onSelectPair(active.pair[0], active.pair[1])}
          className="w-full md:w-auto text-center px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold rounded-xl border border-purple-500/40 transition-all cursor-pointer whitespace-nowrap"
        >
          Explore Synergy Track →
        </button>
      </div>
    </div>
  );
};

/**
 * Bespoke Hand-Crafted Mini Discipline Badges for Course Cards & Lists
 * Gives each course an artisanal, scientific emblem rather than a generic solid square.
 */
export const CourseDisciplineBadge: React.FC<{ courseId: string; color: string; size?: number }> = ({
  courseId,
  color,
  size = 44,
}) => {
  switch (courseId) {
    case 'bio-101':
      return (
        <div
          className="rounded-xl flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ width: size, height: size, backgroundColor: '#06281D' }}
        >
          <svg viewBox="0 0 44 44" fill="none" className="w-full h-full p-1.5">
            {/* DNA double helix mini loop */}
            <path
              d="M10 12 C18 20, 26 24, 34 32"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M10 32 C18 24, 26 20, 34 12"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Base pair connections */}
            <line x1="16" y1="18" x2="28" y2="26" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
            <line x1="28" y1="18" x2="16" y2="26" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
            {/* CRISPR spark dot */}
            <circle cx="22" cy="22" r="2.5" fill="#F59E0B" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle cx="22" cy="22" r="2" fill="#FBBF24" />
          </svg>
        </div>
      );

    case 'law-101':
      return (
        <div
          className="rounded-xl flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ width: size, height: size, backgroundColor: '#0B1E3F' }}
        >
          <svg viewBox="0 0 44 44" fill="none" className="w-full h-full p-1.5">
            {/* Classical Pediment */}
            <path d="M12 16 L22 10 L32 16 Z" fill="#3B82F6" fillOpacity="0.4" stroke="#60A5FA" strokeWidth="1.5" />
            {/* Mast */}
            <line x1="22" y1="16" x2="22" y2="34" stroke="#93C5FD" strokeWidth="1.5" />
            <rect x="14" y="33" width="16" height="3" rx="1" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" />
            {/* Balance beam with sway */}
            <g className="animate-balance-sway">
              <line x1="14" y1="20" x2="30" y2="20" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
              {/* Left pan */}
              <line x1="14" y1="20" x2="11" y2="26" stroke="#93C5FD" strokeWidth="1" />
              <line x1="14" y1="20" x2="17" y2="26" stroke="#93C5FD" strokeWidth="1" />
              <path d="M10 26 Q 14 28 18 26" stroke="#60A5FA" strokeWidth="1.5" fill="#1E40AF" />
              {/* Right pan */}
              <line x1="30" y1="20" x2="27" y2="26" stroke="#93C5FD" strokeWidth="1" />
              <line x1="30" y1="20" x2="33" y2="26" stroke="#93C5FD" strokeWidth="1" />
              <path d="M26 26 Q 30 28 34 26" stroke="#60A5FA" strokeWidth="1.5" fill="#1E40AF" />
            </g>
          </svg>
        </div>
      );

    case 'art-101':
      return (
        <div
          className="rounded-xl flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ width: size, height: size, backgroundColor: '#2E0824' }}
        >
          <svg viewBox="0 0 44 44" fill="none" className="w-full h-full p-1.5">
            {/* Bauhaus Triad Overlap */}
            <circle cx="18" cy="18" r="8" fill="#EC4899" fillOpacity="0.5" stroke="#F472B6" strokeWidth="1.2" />
            <circle cx="26" cy="18" r="8" fill="#8B5CF6" fillOpacity="0.5" stroke="#C084FC" strokeWidth="1.2" />
            <circle cx="22" cy="26" r="8" fill="#F43F5E" fillOpacity="0.5" stroke="#FB7185" strokeWidth="1.2" />
            {/* Golden spiral arc */}
            <path
              d="M22 22 A 4 4 0 0 1 26 18 A 8 8 0 0 1 34 26"
              stroke="#FBBF24"
              strokeWidth="1.5"
              strokeDasharray="2 1.5"
              fill="none"
            />
          </svg>
        </div>
      );

    case 'math-101':
      return (
        <div
          className="rounded-xl flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ width: size, height: size, backgroundColor: '#1E0E3E' }}
        >
          <svg viewBox="0 0 44 44" fill="none" className="w-full h-full p-1.5">
            {/* Coordinate grid */}
            <line x1="8" y1="22" x2="36" y2="22" stroke="#6D28D9" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="22" y1="8" x2="22" y2="36" stroke="#6D28D9" strokeWidth="1" strokeDasharray="2 2" />
            {/* Transformation ellipse */}
            <ellipse cx="22" cy="22" rx="14" ry="7" transform="rotate(-30 22 22)" stroke="#A855F7" strokeWidth="1.5" fill="#8B5CF6" fillOpacity="0.2" />
            {/* Eigenvector arrow */}
            <line x1="22" y1="22" x2="33" y2="13" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
            <polygon points="33,13 29,15 32,18" fill="#F472B6" />
          </svg>
        </div>
      );

    case 'bus-101':
      return (
        <div
          className="rounded-xl flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ width: size, height: size, backgroundColor: '#2E1205' }}
        >
          <svg viewBox="0 0 44 44" fill="none" className="w-full h-full p-1.5">
            {/* Exponential growth curve */}
            <path d="M10 32 Q 22 30 34 10" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
            {/* Network nodes */}
            <line x1="12" y1="26" x2="20" y2="20" stroke="#FB923C" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="20" y1="20" x2="28" y2="16" stroke="#FB923C" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="12" cy="26" r="2.5" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
            <circle cx="20" cy="20" r="3" fill="#F97316" stroke="#FFF" strokeWidth="1" />
            <circle cx="28" cy="16" r="2.5" fill="#FB923C" stroke="#FFF" strokeWidth="1" />
            <circle cx="34" cy="10" r="3.5" fill="#F59E0B" stroke="#FFF" strokeWidth="1" className="animate-pulse" />
          </svg>
        </div>
      );

    case 'mus-101':
      return (
        <div
          className="rounded-xl flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ width: size, height: size, backgroundColor: '#051E28' }}
        >
          <svg viewBox="0 0 44 44" fill="none" className="w-full h-full p-1.5">
            {/* Harmonics wave */}
            <circle cx="22" cy="22" r="14" stroke="#06B6D4" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="2 2" />
            <path
              d="M8 22 Q 15 12 22 22 T 36 22"
              stroke="#38BDF8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M8 22 Q 13 28 18 22 T 28 22 T 36 22"
              stroke="#06B6D4"
              strokeWidth="1.2"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
            {/* Fundamental frequency node */}
            <circle cx="22" cy="22" r="3" fill="#22D3EE" stroke="#FFF" strokeWidth="1" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className="rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ width: size, height: size, backgroundColor: color }}
        />
      );
  }
};

/**
 * Faint Architectural Discipline Watermark rendered on course card backgrounds
 * Lights up organically on card hover to convey craft and domain depth.
 */
export const DisciplineWatermark: React.FC<{ courseId: string }> = ({ courseId }) => {
  switch (courseId) {
    case 'bio-101':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-emerald-500 stroke-current opacity-5 group-hover:opacity-15 transition-opacity duration-300">
          <path d="M20 10 C 50 40, 50 60, 80 90" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M80 10 C 50 40, 50 60, 20 90" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="18" strokeWidth="1.5" />
        </svg>
      );
    case 'law-101':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-blue-500 stroke-current opacity-5 group-hover:opacity-15 transition-opacity duration-300">
          <path d="M15 35 L50 15 L85 35 Z" strokeWidth="2" />
          <line x1="25" y1="35" x2="25" y2="80" strokeWidth="2" />
          <line x1="50" y1="35" x2="50" y2="80" strokeWidth="2" />
          <line x1="75" y1="35" x2="75" y2="80" strokeWidth="2" />
          <line x1="15" y1="80" x2="85" y2="80" strokeWidth="2" />
        </svg>
      );
    case 'art-101':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-pink-500 stroke-current opacity-5 group-hover:opacity-15 transition-opacity duration-300">
          <circle cx="40" cy="40" r="26" strokeWidth="2" />
          <circle cx="60" cy="40" r="26" strokeWidth="2" />
          <circle cx="50" cy="60" r="26" strokeWidth="2" />
        </svg>
      );
    case 'math-101':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-purple-500 stroke-current opacity-5 group-hover:opacity-15 transition-opacity duration-300">
          <line x1="10" y1="50" x2="90" y2="50" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="50" y1="10" x2="50" y2="90" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="50" cy="50" rx="36" ry="18" transform="rotate(-30 50 50)" strokeWidth="2" />
        </svg>
      );
    case 'bus-101':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-orange-500 stroke-current opacity-5 group-hover:opacity-15 transition-opacity duration-300">
          <path d="M15 85 Q 50 80 85 15" strokeWidth="2.5" />
          <line x1="25" y1="70" x2="45" y2="50" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="45" cy="50" r="5" strokeWidth="1.5" />
          <circle cx="85" cy="15" r="7" strokeWidth="1.5" />
        </svg>
      );
    case 'mus-101':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-cyan-500 stroke-current opacity-5 group-hover:opacity-15 transition-opacity duration-300">
          <circle cx="50" cy="50" r="38" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M15 50 Q 32 25 50 50 T 85 50" strokeWidth="2.5" />
          <path d="M15 50 Q 25 65 35 50 T 55 50 T 75 50 T 85 50" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
};

