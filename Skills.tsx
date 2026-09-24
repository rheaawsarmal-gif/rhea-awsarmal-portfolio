"use client";

import { Cpu } from "lucide-react";

export default function Skills() {
  const stack = [
    { name: "Next.js 14 App Router", category: "Core Framework", level: "Expert" },
    { name: "TypeScript 5", category: "Language", level: "Expert" },
    { name: "Framer Motion", category: "Kinetic Motion", level: "Mastery" },
    { name: "HTML5 Canvas API", category: "High-Perf Rendering", level: "Mastery" },
    { name: "Three.js / WebGL", category: "3D & Spatial", level: "Advanced" },
    { name: "GLSL Fragment Shaders", category: "GPU Computing", level: "Advanced" },
    { name: "Tailwind CSS", category: "Styling & Systems", level: "Mastery" },
    { name: "Web Audio API", category: "Sensory Audio", level: "Advanced" },
    { name: "Node.js & Edge APIs", category: "Backend / Infra", level: "Proficient" },
    { name: "Figma & Design Systems", category: "UI/UX Design", level: "Expert" },
  ];

  return (
    <section className="relative w-full py-24 px-6 md:px-12 lg:px-20 bg-[#08090c] border-y border-white/[0.06] z-30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-4">
              <Cpu className="w-3.5 h-3.5" /> Technical Arsenal
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase">
              Tools of the <span className="text-gradient-accent">Craft</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm font-mono text-zinc-400 max-w-sm">
            Carefully curated technologies optimized for 120 FPS performance, maintainability, and visual wonder.
          </p>
        </div>

        {/* Interactive Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {stack.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-2xl glass-card hover:border-pink-500/30 flex flex-col justify-between group transition-all"
            >
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                  {item.category}
                </span>
                <h4 className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
                  {item.name}
                </h4>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                  {item.level}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
