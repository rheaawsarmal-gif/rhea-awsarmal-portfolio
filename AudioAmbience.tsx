"use client";

import { useEffect, useRef } from "react";

interface AudioAmbienceProps {
  enabled: boolean;
}

export default function AudioAmbience({ enabled }: AudioAmbienceProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (!enabled) {
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.4);
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.setTargetAtTime(0.045, ctx.currentTime, 1.2); // subtle, ambient volume

      // Soft Low-pass Filter for dreamy, warm cinematic tone
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(380, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Gentle Harmonic Ambient Chord: F#2, C#3, F#3, A#3, C#4
      const frequencies = [92.5, 138.59, 185.0, 233.08, 277.18];
      const oscs: OscillatorNode[] = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle detuning for lush analog chorus effect
        osc.detune.setValueAtTime((idx - 2) * 5, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.3 / (idx + 1), ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
    } catch {
      // AudioContext unavailable or restricted by browser policy
    }

    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      oscillatorsRef.current = [];
    };
  }, [enabled]);

  return null;
}
