"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function Navbar({
  soundEnabled,
  onToggleSound,
}: {
  soundEnabled: boolean;
  onToggleSound: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setScrolled(currentScroll > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // Suppress unused-vars warning — sound toggle kept for AudioAmbience
  void soundEnabled;
  void onToggleSound;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-8 py-4">
      <div
        className={`max-w-7xl mx-auto rounded-full transition-all duration-500 px-5 py-3 flex items-center justify-between ${
          scrolled
            ? "glass-panel bg-[#08090c]/80 border-white/[0.12] shadow-2xl shadow-black/80"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Brand / Monogram */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shadow-md group-hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #6b2737, #7b4f6e)" }}
          >
            RA
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-white uppercase group-hover:text-[#c4a8b8] transition-colors">
              Rhea Awsarmal
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Marketing × Media
            </div>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 glass-pill px-3 py-1.5 rounded-full">
          {[
            { label: "Work",     id: "experience" },
            { label: "Red",      id: "red-entertainment" },
            { label: "Ask Rhea", id: "ask-rhea" },
            { label: "About",    id: "about-contact" },
            { label: "Contact",  id: "about-contact" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className="px-3.5 py-1 text-xs font-mono tracking-wider text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollToSection("about-contact")}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-all shadow-md active:scale-95 text-white"
            style={{ background: "linear-gradient(135deg, #6b2737, #7b4f6e)" }}
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Global Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-transparent">
        <div
          className="h-full transition-all duration-100 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, #6b2737, #7b4f6e, #c4a8b8)",
          }}
        />
      </div>
    </header>
  );
}
