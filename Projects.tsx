"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Sparkles,
  ArrowUpRight,
  Layers,
  Cpu,
  Eye,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  tagline: string;
  category: "Creative Dev" | "WebGL & 3D" | "Design Systems" | "Experimental";
  awards: string[];
  description: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
  demoUrl?: string;
  githubUrl?: string;
  visualTheme: string;
}

const PROJECTS: Project[] = [
  {
    id: "aether-spatial",
    title: "Aether Spatial OS",
    tagline: "Next-Gen Spatial Web & 3D Interactive Canvas",
    category: "WebGL & 3D",
    awards: ["Awwwards Site of the Day", "FWA of the Month"],
    description:
      "A high-framerate spatial browser interface designed for spatial computing. Features GPU fluid simulation shaders, spatial audio positioning, and zero-latency drag-and-drop physics.",
    tags: ["Next.js 14", "Three.js", "GLSL Shaders", "Framer Motion"],
    metrics: [
      { label: "Rendering Rate", value: "120 FPS" },
      { label: "Community", value: "48k+ Users" },
      { label: "Bundle Size", value: "42 KB Core" },
    ],
    accentColor: "from-pink-500/20 via-purple-500/10 to-transparent",
    visualTheme: "pink",
  },
  {
    id: "chronos-engine",
    title: "Chronos Engine",
    tagline: "GPU-Accelerated Audiovisual Particle Playground",
    category: "Creative Dev",
    awards: ["Developer Award 2026", "Awwwards Nominee"],
    description:
      "Real-time procedural synthesizer translating ambient micro-frequencies into 250,000 kinetic particles. Scrubbed dynamically using HTML5 Canvas and Web Audio API synthesis.",
    tags: ["Web Audio API", "HTML5 Canvas", "TypeScript", "Tailwind CSS"],
    metrics: [
      { label: "Particle Count", value: "250,000" },
      { label: "Audio Latency", value: "< 6ms" },
      { label: "License", value: "MIT Open Source" },
    ],
    accentColor: "from-cyan-500/20 via-blue-500/10 to-transparent",
    visualTheme: "cyan",
  },
  {
    id: "luminary-atelier",
    title: "Luminary AI Atelier",
    tagline: "Luxury Digital Flagship & Photorealistic 3D Twin",
    category: "Design Systems",
    awards: ["CSSDA Special Kudos", "FWA of the Day"],
    description:
      "Bespoke digital flagship for a Paris haute couture house. Real-time cloth simulation, kinetic typography, and seamless transitions with 0.3s Largest Contentful Paint.",
    tags: ["Next.js App Router", "Tailwind CSS", "Shopify API", "Three.js"],
    metrics: [
      { label: "Conversion Lift", value: "+340%" },
      { label: "Core Web Vitals", value: "100/100" },
      { label: "Global Stores", value: "18 Cities" },
    ],
    accentColor: "from-purple-500/20 via-pink-500/10 to-transparent",
    visualTheme: "purple",
  },
  {
    id: "synapse-protocol",
    title: "Synapse Protocol",
    tagline: "Autonomous Topological Network Intelligence",
    category: "Experimental",
    awards: ["Wired Innovation Showcase"],
    description:
      "High-density data visualization platform rendering 50,000 live transactional nodes with real-time cluster physics, anomaly heatmaps, and customizable shader filters.",
    tags: ["React", "D3.js", "WebSockets", "GPGPU Compute"],
    metrics: [
      { label: "Live Nodes", value: "50,000+" },
      { label: "Frame Time", value: "7.2 ms" },
      { label: "Throughput", value: "1.2M msg/s" },
    ],
    accentColor: "from-emerald-500/20 via-cyan-500/10 to-transparent",
    visualTheme: "emerald",
  },
];

const CATEGORIES = ["All", "Creative Dev", "WebGL & 3D", "Design Systems", "Experimental"] as const;

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative w-full py-32 px-6 md:px-12 lg:px-20 bg-[#08090c] z-30">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-500/5 via-pink-500/5 to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-pink-400 uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Selected Works (2024 — 2026)
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase">
              Featured <span className="text-gradient-accent">Case Studies</span>
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-sm md:text-base text-zinc-400 max-w-md font-light">
            A curated collection of production applications, WebGL experiments, and award-winning interactive systems.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-white text-black font-semibold shadow-lg shadow-white/10"
                  : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onOpenModal={() => setActiveProjectModal(project)}
            />
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-pink-400 block mb-2">
              Have a visionary project in mind?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Let&apos;s push the boundaries of digital craft.
            </h3>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <a
              href="#contact"
              className="px-6 py-3.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/20 active:scale-95"
            >
              Start A Conversation
            </a>
          </div>

          {/* Background subtle gradient flare */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Case Study Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-10 border border-white/20 text-white shadow-2xl">
            <button
              onClick={() => setActiveProjectModal(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-mono transition-all"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-pink-400 uppercase mb-4">
              {activeProjectModal.category}
            </div>

            <h3 className="text-3xl font-black mb-2">{activeProjectModal.title}</h3>
            <p className="text-sm font-mono text-zinc-400 mb-6">
              {activeProjectModal.tagline}
            </p>

            <p className="text-base text-zinc-300 leading-relaxed mb-6 font-light">
              {activeProjectModal.description}
            </p>

            {/* Awards badge list */}
            <div className="mb-6 space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
                Recognition
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProjectModal.awards.map((award) => (
                  <span
                    key={award}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300"
                  >
                    <Award className="w-3.5 h-3.5" /> {award}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-8">
              {activeProjectModal.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-lg font-bold text-white">{m.value}</div>
                  <div className="text-[11px] font-mono text-zinc-400">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  alert(`Navigating to interactive preview of ${activeProjectModal.title}`);
                  setActiveProjectModal(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-medium text-xs font-mono uppercase tracking-wider text-white flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                <span>Launch Interactive Demo</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Individual Interactive Glassmorphic Project Card
function ProjectCard({
  project,
  index,
  onOpenModal,
}: {
  project: Project;
  index: number;
  onOpenModal: () => void;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenModal}
      className="group relative rounded-3xl glass-card p-7 sm:p-9 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500 rounded-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 63, 142, 0.14), transparent 80%)`,
        }}
      />

      <div>
        {/* Top bar: Category + Awards */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/5 border border-white/10 text-zinc-300">
            {project.category}
          </span>

          {project.awards.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Award className="w-3 h-3" />
              <span>{project.awards[0]}</span>
            </div>
          )}
        </div>

        {/* Visual Simulated Mockup / Preview Banner */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center p-6">
          {/* Decorative geometric shader mesh effect */}
          <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

          {/* Project-specific visual graphic */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            {project.visualTheme === "pink" && (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-500">
                <Layers className="w-8 h-8 text-white" />
              </div>
            )}
            {project.visualTheme === "cyan" && (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="w-8 h-8 text-white" />
              </div>
            )}
            {project.visualTheme === "purple" && (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            )}
            {project.visualTheme === "emerald" && (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                <Eye className="w-8 h-8 text-white" />
              </div>
            )}

            <span className="mt-3 text-xs font-mono text-zinc-400 tracking-wider">
              INTERACTIVE CASE STUDY
            </span>
          </div>

          {/* Top-right open icon button */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-pink-300 transition-colors duration-300 mb-2">
          {project.title}
        </h3>
        <p className="text-xs font-mono text-zinc-400 mb-4">{project.tagline}</p>

        {/* Description */}
        <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6 line-clamp-2">
          {project.description}
        </p>
      </div>

      <div>
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-6">
          {project.metrics.map((m) => (
            <div key={m.label} className="text-left">
              <div className="text-xs font-bold text-white font-mono">{m.value}</div>
              <div className="text-[10px] text-zinc-500 font-mono uppercase">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[11px] font-mono rounded-md bg-white/[0.04] text-zinc-400 border border-white/[0.04]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
