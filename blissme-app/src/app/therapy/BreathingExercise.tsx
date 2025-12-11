import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BreathingProtocol, PROTOCOLS } from "../../components/therapy/protocols";
import { useNavigate } from "react-router-dom";

type Props = {
  protocolId?: string;
  durationMinutes?: number;
  onSessionComplete?: (summary: any) => void;
  apiBase?: string;
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const API_URL = process.env.REACT_APP_API_URL;

const AdvancedBreathing: React.FC<Props> = ({
  protocolId = "resonance-6bpm",
  durationMinutes = 5,
  onSessionComplete,
  apiBase = `${API_URL}`,
}) => {
  // keep protocol lookup in case other logic depends on it elsewhere
  const protocol: BreathingProtocol = useMemo(
    () => PROTOCOLS.find((p) => p.id === protocolId) || PROTOCOLS[0],
    [protocolId]
  );

  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsedMsInPhase, setElapsedMsInPhase] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const liveRef = useRef<HTMLDivElement>(null);
  const announce = useCallback((msg: string) => {
    if (liveRef.current) {
      liveRef.current.textContent = msg;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = "";
      }, 500);
    }
  }, []);

  const totalMs = durationMinutes * 60_000;

  // Fixed phases per your request: Inhale 4s, Hold 2s, Exhale 6s (repeat)
  const localPhases = useMemo(
    () => [
      { name: "inhale", durationMs: 4000 },
      { name: "hold", durationMs: 2000 },
      { name: "exhale", durationMs: 6000 },
    ],
    []
  );

  // current phase derived from our localPhases (not protocol phases)
  const phase = localPhases[phaseIndex];
  const phaseDurations = localPhases.map((p) => p.durationMs);

  useEffect(() => {
    // announce the phase for accessibility (no audio/haptics)
    const label =
      phase.name === "inhale"
        ? "Inhale"
        : phase.name === "exhale"
        ? "Exhale"
        : "Hold";
    announce(label);
  }, [phaseIndex, phase.name, announce]);

  const tick = useCallback(
    (now: number) => {
      if (!running) return;
      if (startTimeRef.current == null) startTimeRef.current = now;
      if (lastTickRef.current == null) lastTickRef.current = now;

      const phaseElapsed = elapsedMsInPhase + (now - (lastTickRef.current || now));
      setElapsedMsInPhase(phaseElapsed);
      lastTickRef.current = now;

      if (phaseElapsed >= phaseDurations[phaseIndex]) {
        const nextPhase = (phaseIndex + 1) % phaseDurations.length;
        setPhaseIndex(nextPhase);
        setElapsedMsInPhase(0);
        if (nextPhase === 0) setCyclesCompleted((c) => c + 1);
      }

      const sessionElapsed = now - (startTimeRef.current || now);
      if (sessionElapsed >= totalMs) {
        setRunning(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [running, elapsedMsInPhase, phaseIndex, phaseDurations, totalMs]
  );

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [running, tick]);

  useEffect(() => {
    if (!running && cyclesCompleted > 0) {
      const summary = {
        protocolId: protocol.id,
        durationMinutes,
        cyclesCompleted,
        timestamp: new Date().toISOString(),
      };
      onSessionComplete?.(summary);
      fetch(`${apiBase}/therapy/breathing/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      }).catch(() => {});
    }
    
  }, [running]);

  // Use the local phase duration for progress calculation
  const phaseProgress = Math.min(1, elapsedMsInPhase / phase.durationMs);

  // remaining time calculation (defensive fallback if refs are null)
  const remainingMs =
    totalMs - ((lastTickRef.current || Date.now()) - (startTimeRef.current || Date.now()));
  const remainingMin = Math.max(0, Math.floor(remainingMs / 60000));
  const remainingSec = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  const minR = 70,
    maxR = 110;
  const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;
  const sizeT =
    phase.name === "inhale"
      ? ease(phaseProgress)
      : phase.name === "exhale"
      ? 1 - ease(phaseProgress)
      : 0.5; // hold
  const radius = prefersReducedMotion ? (minR + maxR) / 2 : minR + (maxR - minR) * sizeT;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="w-full max-w-xl bg-emerald-400/30 rounded-2xl shadow-md p-6 relative flex flex-col items-center">
        {/* Heading centered */}
        <h2
          className="text-2xl font-bold text-emerald-900 text-center mb-2"
          style={{ fontFamily: "Merienda, cursive" }}
        >
          Mindful Breathing
        </h2>

        {/* Instructions */}
        <p className="text-sm text-emerald-800 opacity-90 text-center mb-4 max-w-prose">
          Inhale 4 seconds → Hold 2 seconds → Exhale 6 seconds.  — follow the visual guide and the on-screen labels.
        </p>

        {/* Timer */}
        <span className="px-3 py-1 rounded-md bg-emerald-500 text-white font-mono text-sm mb-4">
          {String(remainingMin).padStart(2, "0")}:
          {String(remainingSec).padStart(2, "0")}
        </span>

        {/* Breathing animation */}
        <div className="relative mb-4">
          <svg width="260" height="260" viewBox="0 0 320 320">
            <circle
              cx="160"
              cy="160"
              r="130"
              fill="none"
              strokeWidth="10"
              strokeOpacity="0.1"
              stroke="currentColor"
            />

            <g transform="rotate(-90 160 160)">
              <circle
                cx="160"
                cy="160"
                r="130"
                fill="none"
                strokeWidth="10"
                strokeDasharray={`${phaseProgress * 2 * Math.PI * 130} ${2 * Math.PI * 130}`}
                strokeLinecap="round"
                stroke="currentColor"
              />
            </g>

            <circle cx="160" cy="160" r={radius} fill="currentColor" opacity="0.2" />
          </svg>

          {/* Center label: appears during the active phase (Inhale / Hold / Exhale) */}
          <div className="absolute inset-0 flex items-center justify-center text-xl font-medium">
            {phase.name.charAt(0).toUpperCase() + phase.name.slice(1)}
          </div>
        </div>

        {/* Cycles + Remaining time */}
        <div className="text-sm opacity-70 mb-4">
          Time remaining: {String(remainingMin).padStart(2, "0")}:
          {String(remainingSec).padStart(2, "0")}
          · Cycles: {cyclesCompleted}
        </div>

        {/* Control buttons */}
        <div className="mt-4 mb-4 flex justify-center gap-4">
          <button
            className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-medium shadow hover:bg-emerald-600"
            onClick={() => {
              setPhaseIndex(0);
              setElapsedMsInPhase(0);
              setCyclesCompleted(0);
              startTimeRef.current = null;
              lastTickRef.current = null;
              setRunning(true);
            }}
          >
            ▶ Start
          </button>

          <button
            className="px-6 py-2 rounded-xl bg-gray-100 text-gray-800 font-medium shadow hover:bg-gray-200"
            onClick={() => setRunning(false)}
          >
            ⏸ Pause
          </button>

          <button
            className="px-6 py-2 rounded-xl bg-red-500 text-white font-medium shadow hover:bg-red-600"
            onClick={() => setRunning(false)}
          >
            ⏹ Stop
          </button>
        </div>

        {/* Warning */}
        <p className="text-xs text-center max-w-prose opacity-70 mb-10">
          This feature guides evidence-based slow/paced breathing. Stop if you feel dizzy, light-headed, or unwell.
        </p>

        {/* Back button at bottom-left */}
        <button
          onClick={() => navigate("/chat-new/text")}
          className="absolute bottom-4 left-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
        >
          ← Back to Chat
        </button>

        {/* Live region for accessibility announcements */}
        <div aria-live="polite" ref={liveRef} className="sr-only" />
      </div>
    </div>
  );
};

export default AdvancedBreathing;
