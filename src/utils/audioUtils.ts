class AudioContextSingleton {
  private static instance: AudioContext | null = null;

  static getInstance(): AudioContext {
    if (!this.instance) {
      this.instance = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.instance;
  }
}

const createOscillator = (frequency: number, startTime: number, duration: number) => {
  const audioContext = AudioContextSingleton.getInstance();
  
  // Create oscillator and gain nodes
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Set oscillator properties
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startTime);
  
  // Configure envelope
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  return oscillator;
};

const getNoteFrequency = (note: string): number => {
  const noteMap: { [key: string]: number } = {
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56,
    'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00,
    'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
    'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88
  };
  return noteMap[note] || 440; // Default to A4 if note not found
};

export const playNote = (note: string) => {
  const audioContext = AudioContextSingleton.getInstance();
  const now = audioContext.currentTime;
  const duration = 0.5; // Duration in seconds
  
  // Create and start primary oscillator
  const primaryOsc = createOscillator(getNoteFrequency(note), now, duration);
  primaryOsc.start(now);
  primaryOsc.stop(now + duration);
  
  // Create a slightly detuned oscillator for richer sound
  const detunedOsc = createOscillator(getNoteFrequency(note) * 1.001, now, duration);
  detunedOsc.start(now);
  detunedOsc.stop(now + duration);
};

export const playSuccessSound = () => {
  const audioContext = AudioContextSingleton.getInstance();
  const now = audioContext.currentTime;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(587.33, now); // D5
  osc.frequency.setValueAtTime(880, now + 0.1); // A5
  
  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start(now);
  osc.stop(now + 0.3);
};

export const playFailureSound = () => {
  const audioContext = AudioContextSingleton.getInstance();
  const now = audioContext.currentTime;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now); // A3
  osc.frequency.setValueAtTime(196, now + 0.1); // G3
  
  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start(now);
  osc.stop(now + 0.3);
};
