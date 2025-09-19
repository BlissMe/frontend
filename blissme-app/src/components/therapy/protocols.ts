// Types & clinically-informed presets
export type PhaseName = "inhale" | "hold" | "exhale";
export interface BreathingPhase {
  name: PhaseName;
  // milliseconds for precise pacing; UI shows seconds
  durationMs: number;
  audioCue?: boolean;
  hapticCue?: boolean;
}
export interface BreathingProtocol {
  id: string;
  label: string;
  bpm?: number;           // for paced protocols (6 BPM = 10s cycle)
  cycleMs: number;
  phases: BreathingPhase[];
  notes?: string;
}

// Resonance: ~0.1 Hz (6 BPM) => 10,000 ms per cycle
export const Resonance6BPM: BreathingProtocol = {
  id: "resonance-6bpm",
  label: "Resonance (≈6 BPM / 0.1 Hz)",
  bpm: 6,
  cycleMs: 10000,
  // split 10s as ~4s inhale, ~6s exhale (common variant)
  phases: [
    { name: "inhale", durationMs: 4000, audioCue: true, hapticCue: true },
    { name: "exhale", durationMs: 6000, audioCue: true, hapticCue: true },
  ],
  notes:
    "Evidence-backed paced breathing near 0.1 Hz increases HRV; personalize between 4.5–6.5 BPM if possible.",
};

// 4-7-8 protocol (19s total)
export const FourSevenEight: BreathingProtocol = {
  id: "4-7-8",
  label: "4-7-8 (Anxiety relief)",
  cycleMs: 19000,
  phases: [
    { name: "inhale", durationMs: 4000, audioCue: true, hapticCue: true },
    { name: "hold",   durationMs: 7000, audioCue: true, hapticCue: false },
    { name: "exhale", durationMs: 8000, audioCue: true, hapticCue: true  },
  ],
  notes: "Shown to reduce anxiety in clinical contexts (e.g., perioperative).",
};

// Box breathing: 4-4-4-4 (16s total)
export const Box4444: BreathingProtocol = {
  id: "box-4-4-4-4",
  label: "Box Breathing (4-4-4-4)",
  cycleMs: 16000,
  phases: [
    { name: "inhale", durationMs: 4000, audioCue: true,  hapticCue: true },
    { name: "hold",   durationMs: 4000, audioCue: false, hapticCue: false },
    { name: "exhale", durationMs: 4000, audioCue: true,  hapticCue: true },
    { name: "hold",   durationMs: 4000, audioCue: false, hapticCue: false },
  ],
  notes: "Popularized in tactical settings; equal counts calm & focus.",
};

export const PROTOCOLS: BreathingProtocol[] = [
  Resonance6BPM,
  FourSevenEight,
  Box4444,
];
