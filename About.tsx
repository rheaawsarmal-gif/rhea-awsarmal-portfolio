"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Cpu, Flame, Target, CheckCircle2 } from "lucide-react";

export default function About() {
  const stats = [
    { value: "04", label: "Awwwards SOTD", icon: Sparkles },
    { value: "06", label: "FWA Recognitions", icon: Flame },
    { value: "100%", label: "60-120 FPS Standard", icon: Cpu },
    { value: "07+", label: "Years Creative Engineering", icon: Terminal },
  ];

  const pillars = [
    {
      title: "Tactile Kinetic Fluidity",
      description:
        "Every scroll scrub, cursor hover, and screen transition is physically mapped to spring physics, creating digital surfaces that feel real and alive.",
      tags: ["Framer Motion", "Physics Springs", "Velocity Inertia"],
    },
    {
      title: "Hardware-Accelerated WebGL",
      description:
        "Pushing browser rendering boundaries with custom fragment shaders, GPGPU particles, and optimized memory lifecycles that never drop a single frame.",
      tags: ["Three.js", "GLSL Shaders", "HTML5 Canvas API"],
    },
    {
      title: "Architectural Rigor",
      description:
        "Aesthetic brilliance means nothing without speed and durability. Leveraging Next.js 14 App Router, streaming SSR, and micro-bundle optimizations.",
      tags: ["Next.js 14", "TypeScript", "Performance Profiling"],
    },
  ];

  return (
    <section id="about" className="relative w-full py-32 px-6 md:px-12 lg:px-20 bg-[#08090c] z-30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-pink-400 uppercase mb-4">
            <Target className="w-3.5 h-3.5" /> Core Philosophy
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight">
            Code as an <br />
            <span className="text-gradient-accent">Artistic Medium.</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            I don’t just write software; I sculpt interactive atmospheres.
            Drawing inspiration from industrial design, cinema, and modern architecture,
            my goal is to replace sterile websites with unforgettable sensory journeys.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl glass-card flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-4xl font-black font-mono text-white">
                    {stat.value}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-pink-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xs font-mono tracking-wider uppercase text-zinc-400">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 rounded-3xl glass-card flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block mb-3">
                  Pillar 0{idx + 1}
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">{pillar.title}</h3>
                <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.08]">
                {pillar.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.03] text-zinc-400 border border-white/[0.05]"
                  >
                    <CheckCircle2 className="w-3 h-3 text-pink-400" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
