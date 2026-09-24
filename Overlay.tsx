"use client";

import React from "react";
import { ArrowDown, Film, Layers, Sparkles } from "lucide-react";

interface OverlayProps {
  progress: number;
}

// Computes smooth fade-in, plateau, fade-out, and parallax Y translation
function getSectionStyle(
  progress: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
  yOffset: number = 50
) {
  if (progress < inStart || progress > outEnd) {
    return {
      opacity: 0,
      display: "none" as const,
      transform: `translate3d(0, ${yOffset}px, 0)`,
    };
  }

  let opacity = 1;
  let currentY = 0;

  if (progress < inEnd) {
    const ratio = Math.max(0, Math.min(1, (progress - inStart) / (inEnd - inStart)));
    opacity = ratio;
    currentY = (1 - ratio) * yOffset;
  } else if (progress > outStart) {
    const ratio = Math.max(0, Math.min(1, (progress - outStart) / (outEnd - outStart)));
    opacity = 1 - ratio;
    currentY = -ratio * yOffset;
  }

  return {
    opacity,
    display: "flex" as const,
    transform: `translate3d(0, ${currentY}px, 0)`,
    transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
  };
}

export default function Overlay({ progress }: OverlayProps) {
  // Section 1: Hero (0% - 18%)
  const s1Style = getSectionStyle(progress, -1, 0, 0.09, 0.18, -60);

  // Section 2: Statement 1 (20% - 46%) - Left Aligned
  const s2Style = getSectionStyle(progress, 0.20, 0.27, 0.40, 0.46, 50);

  // Section 3: Statement 2 (48% - 74%) - Right Aligned
  const s3Style = getSectionStyle(progress, 0.48, 0.55, 0.67, 0.74, 50);

  // Section 4: Resolution (76% - 100%) - Center
  const s4Style = getSectionStyle(progress, 0.76, 0.83, 0.95, 1.0, 50);

  const scrollToWork = () => {
    const el = document.getElementById("experience");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">

      {/* SECTION 1: 0% scroll — Center Identity */}
      <div
        style={s1Style}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
      >
        {/* Status badge */}
        <div className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
            Open to opportunities
          </span>
        </div>

        {/* Name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase text-white mb-3 leading-none drop-shadow-2xl">
          Rhea Awsarmal<span style={{ color: "#6b2737" }}>.</span>
        </h1>

        <p className="text-lg sm:text-2xl md:text-3xl font-light text-zinc-300 tracking-wide max-w-2xl drop-shadow-md">
          Marketing × Media × AI × Creative Production
        </p>

        {/* Detail badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono uppercase tracking-widest text-zinc-300 drop-shadow-md">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" style={{ color: "#c4a8b8" }} /> Marketing
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" style={{ color: "#c4a8b8" }} /> Media &amp; Production
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#c4a8b8" }} /> AI Creative
          </span>
        </div>

        {/* Scroll prompt */}
        <div className="mt-14 flex flex-col items-center gap-2 text-zinc-400">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400">
            Scroll through the sequence
          </span>
          <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#6b2737" }} />
          </div>
        </div>
      </div>

      {/* SECTION 2: ~30% scroll — Left Aligned */}
      <div
        style={s2Style}
        className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono tracking-widest uppercase mb-4 backdrop-blur-md" style={{ color: "#c4a8b8" }}>
          01 // Vision
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-2xl">
          I connect ideas,<br />
          <span className="text-gradient-accent">audiences and execution.</span>
        </h2>

        <p className="mt-6 text-base sm:text-lg text-zinc-200 font-light leading-relaxed drop-shadow-md">
          From retail floors and streetwear events to film sets and AI-assisted production —
          I work where strategy meets creativity.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["Brand Strategy", "Creative Production", "AI Workflows"].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1 text-xs font-mono rounded-full bg-black/60 border border-white/15 text-zinc-200 backdrop-blur-md shadow-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 3: ~60% scroll — Right Aligned */}
      <div
        style={s3Style}
        className="absolute inset-0 flex flex-col items-end justify-center p-8 md:p-16 lg:p-24 ml-auto max-w-2xl text-right"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono tracking-widest uppercase mb-4 backdrop-blur-md" style={{ color: "#c4a8b8" }}>
          02 // Craft
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-2xl">
          Where creativity<br />
          <span className="text-gradient-accent">meets commerce.</span>
        </h2>

        <p className="mt-6 text-base sm:text-lg text-zinc-200 font-light leading-relaxed drop-shadow-md">
          Marketing without a story is noise. Production without strategy is art for art&apos;s sake.
          My work lives in the intersection.
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {["Red Entertainment", "IIM Indore", "Jio Creative Labs"].map((item) => (
            <span
              key={item}
              className="px-3.5 py-1 text-xs font-mono rounded-full bg-black/60 border border-white/15 text-zinc-200 backdrop-blur-md shadow-lg"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 4: ~85% — Center Resolution */}
      <div
        style={s4Style}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono tracking-wider uppercase mb-4 backdrop-blur-md" style={{ background: "rgba(107,39,55,0.1)", borderColor: "rgba(107,39,55,0.3)", color: "#c4a8b8" }}>
          03 // The Work
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-2xl">
          The sequence is complete.
        </h2>

        <p className="text-base sm:text-lg text-zinc-200 font-light max-w-lg mx-auto mb-8 drop-shadow-md">
          From sales floors and streetwear events to film competitions and AI production —
          the work is below.
        </p>

        <button
          onClick={scrollToWork}
          className="pointer-events-auto inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-medium text-xs font-mono uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6b2737, #7b4f6e)" }}
        >
          <span>Explore My Work</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </div>
  );
}
