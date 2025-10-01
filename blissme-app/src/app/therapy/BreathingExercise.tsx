import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BreathingProtocol,
  PROTOCOLS,
} from "../../components/therapy/protocols";

type Props = {
  protocolId?: string;
  durationMinutes?: number;
  onSessionComplete?: (summary: any) => void;
  apiBase?: string;
};

const AUDIO_FREQ = 440;
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
  const protocol: BreathingProtocol = useMemo(
    () => PROTOCOLS.find((p) => p.id === protocolId) || PROTOCOLS[0],
    [protocolId]
  );

  
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsedMsInPhase, setElapsedMsInPhase] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const cue = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = AUDIO_FREQ;
      g.gain.value = 0.0001; // very soft
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      // short fade in/out
      g.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      o.stop(ctx.currentTime + 0.2);
    } catch {
    }
  }, []);

  // Haptic cue
  const haptic = useCallback((ms = 25) => {
    if (navigator.vibrate) navigator.vibrate(ms);
  }, []);

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
  const phaseDurations = useMemo(
    () => protocol.phases.map((p) => p.durationMs),
    [protocol]
  );
  const phase = protocol.phases[phaseIndex];

  useEffect(() => {
    const label =
      phase.name === "inhale"
        ? "Inhale"
        : phase.name === "exhale"
        ? "Exhale"
        : "Hold";
    announce(label);
    if (phase.audioCue) cue();
    if (phase.hapticCue) haptic();
  }, [phaseIndex]); 

  const tick = useCallback(
    (now: number) => {
      if (!running) return;
      if (startTimeRef.current == null) startTimeRef.current = now;
      if (lastTickRef.current == null) lastTickRef.current = now;

      const phaseElapsed =
        elapsedMsInPhase + (now - (lastTickRef.current || now));
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
        cancelAnimationFrame(rafRef.current!);
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

  const phaseProgress = Math.min(1, elapsedMsInPhase / phase.durationMs);
  const remainingMs =
    totalMs - ((lastTickRef.current || 0) - (startTimeRef.current || 0));
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
  const radius = prefersReducedMotion
    ? (minR + maxR) / 2
    : minR + (maxR - minR) * sizeT;

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-green-100 rounded-2xl shadow-md p-8 relative">
        {/* Header row */}
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="flex justify-between mb-6 w-full">
            <h2 className="text-2xl font-bold text-green-600">
              Mindful Breathing
            </h2>
            <span className="px-3 py-1 rounded-md bg-green-500 text-white font-mono text-sm">
              {String(remainingMin).padStart(2, "0")}:
              {String(remainingSec).padStart(2, "0")}
            </span>
          </div>
          <div className="relative">
            <svg width="320" height="320" viewBox="0 0 320 320">
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
                  strokeDasharray={`${phaseProgress * 2 * Math.PI * 130} ${
                    2 * Math.PI * 130
                  }`}
                  strokeLinecap="round"
                  stroke="currentColor"
                />
              </g>
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-medium">
              {phase.name.charAt(0).toUpperCase() + phase.name.slice(1)}
            </div>
          </div>

          <div className="text-sm opacity-70">
            Time remaining: {String(remainingMin).padStart(2, "0")}:
            {String(remainingSec).padStart(2, "0")} · Cycles: {cyclesCompleted}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              className="px-6 py-2 rounded-xl bg-green-500 text-white font-medium shadow hover:bg-green-600"
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

          <p className="text-xs text-center max-w-prose opacity-70">
            This feature guides evidence-based slow/paced breathing. Stop if you
            feel dizzy, light-headed, or unwell.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedBreathing;
