"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Overlay from "./Overlay";

const TOTAL_FRAMES = 120;

// Format: /sequence/frame_000_delay-0.067s.webp ... frame_119_delay-0.067s.webp
const getFrameUrl = (index: number) => {
  const paddedIndex = String(index).padStart(3, "0");
  return `/sequence/frame_${paddedIndex}_delay-0.067s.webp`;
};

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preloaded images storage
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Loading state
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Render a specific frame on the canvas with object-fit: cover math
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    // object-fit: cover logic
    if (canvasRatio > imgRatio) {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    }

    ctx.fillStyle = "#08090c";
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Update canvas pixel buffer + CSS display size for high DPI screens
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set the actual pixel buffer dimensions
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Set CSS display size so the canvas visually fills the container
    // without the CSS 100%/100% stretching a tiny default pixel buffer
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // FIX 2: Run synchronously before first paint to avoid the default 300×150 canvas buffer
  useLayoutEffect(() => {
    updateCanvasDimensions();
  }, [updateCanvasDimensions]);

  // Preload all 120 WebP images on mount
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    // FIX 1a: Pre-allocate the array and assign imagesRef BEFORE starting any loads.
    // This ensures that if onload fires synchronously (browser cache hit), the ref
    // is already pointing at the array that contains the image at its correct index.
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = images;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const frameIndex = i; // capture for closure
      const img = new Image();

      // FIX 1b: Always set onload/onerror BEFORE setting src.
      // If the browser cache serves the image synchronously, the handler
      // must already exist at the moment src is assigned.
      img.onload = () => {
        if (isCancelled) return;
        images[frameIndex] = img;
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadProgress(pct);

        // Draw initial frame as soon as frame 0 is ready
        if (frameIndex === 0 && currentFrameRef.current === 0) {
          renderFrame(0);
        }

        if (loadedCount >= TOTAL_FRAMES) {
          setIsLoaded(true);
          renderFrame(currentFrameRef.current);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadProgress(pct);
        if (loadedCount >= TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      // Set src after handlers are registered
      img.src = getFrameUrl(frameIndex);

      // Also store the img object immediately so the ref array slot is
      // occupied even before onload confirms the decode is complete
      images[frameIndex] = img;
    }

    // Window resize handler
    window.addEventListener("resize", updateCanvasDimensions);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", updateCanvasDimensions);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame, updateCanvasDimensions]);

  // FIX 3: Replace framer-motion useScroll (broken in FM v13 for window-scroll targets)
  // with a direct window 'scroll' event listener for reliable cross-version behavior.
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // getBoundingClientRect().top is viewport-relative.
      // Negating it gives us how far we've scrolled past the container's top edge.
      const rect = container.getBoundingClientRect();
      const scrolledPastTop = -rect.top;
      const scrollableDistance = container.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolledPastTop / scrollableDistance));
      setScrollProgress(progress);

      // Map 0 -> 1 progress to 0 -> (TOTAL_FRAMES - 1)
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(progress * TOTAL_FRAMES))
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;

        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          renderFrame(targetFrame);
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once immediately to set initial state (progress = 0, frame 0)
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame]);

  return (
    <div
      ref={containerRef}
      id="hero-canvas-container"
      className="relative w-full h-[500vh] bg-[#08090c]"
    >
      {/* Luxury Loading Screen Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090c] text-white"
          >
            {/* Ambient Background Aura */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-cyan-500/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm px-6 text-center">
              {/* Monogram Badge */}
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-sm font-mono tracking-widest text-pink-400 bg-white/5 backdrop-blur-md">
                ER
              </div>

              {/* Title & Status */}
              <div>
                <h2 className="text-xl font-medium tracking-tight text-white/90">
                  Elena Rostova
                </h2>
                <p className="text-xs font-mono tracking-widest uppercase text-white/40 mt-1">
                  Loading Experience Assets
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
                  style={{ width: `${loadProgress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>

              {/* Percentage & Total Frames Counter */}
              <div className="flex items-center justify-between w-64 text-[11px] font-mono text-white/50">
                <span>{loadProgress}%</span>
                <span>
                  {Math.round((loadProgress / 100) * TOTAL_FRAMES)} / {TOTAL_FRAMES} FRAMES
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* HTML5 Canvas — width/height attributes are controlled imperatively via updateCanvasDimensions */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block"
        />

        {/* Cinematic Vignette & Edge Blending Overlays */}
        {/* Top subtle fade for navbar readability */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#08090c]/90 via-[#08090c]/30 to-transparent pointer-events-none z-10" />

        {/* Ambient side glow matching neon lighting */}
        <div className="absolute -left-48 top-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute -right-48 top-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

        {/* Bottom seamless transition into Projects section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#08090c] via-[#08090c]/60 to-transparent pointer-events-none z-10" />

        {/* Interactive Parallax Story Overlay */}
        <Overlay progress={scrollProgress} />
      </div>
    </div>
  );
}
