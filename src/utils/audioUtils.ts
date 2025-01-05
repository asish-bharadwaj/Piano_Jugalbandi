import * as Tone from 'tone';

// Initialize synth
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
synth.set({
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.3,
    release: 1.2,
  },
});

const noteMapping: { [key: string]: string } = {
  'C4': 'C4', 'C#4': 'C#4', 'D4': 'D4', 'D#4': 'D#4',
  'E4': 'E4', 'F4': 'F4', 'F#4': 'F#4', 'G4': 'G4',
  'G#4': 'G#4', 'A4': 'A4', 'A#4': 'A#4', 'B4': 'B4',
  'C5': 'C5', 'C#5': 'C#5', 'D5': 'D5', 'D#5': 'D#5',
  'E5': 'E5', 'F5': 'F5', 'F#5': 'F#5', 'G5': 'G5',
  'G#5': 'G#5', 'A5': 'A5', 'A#5': 'A#5', 'B5': 'B5'
};

export const playNote = async (note: string) => {
  await Tone.start();
  const toneNote = noteMapping[note];
  if (toneNote) {
    synth.triggerAttackRelease(toneNote, '0.7');
  }
};

// Success sound using Tone.js
export const playSuccessSound = async () => {
  await Tone.start();
  const successSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  successSynth.set({
    envelope: {
      attack: 0.02,
      decay: 0.2,
      sustain: 0.2,
      release: 0.5,
    },
  });
  
  successSynth.triggerAttackRelease(['C5', 'E5', 'G5'], '8n', Tone.now());
  setTimeout(() => successSynth.dispose(), 1000);
};

// Failure sound using Tone.js
export const playFailureSound = async () => {
  await Tone.start();
  const failureSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  failureSynth.set({
    envelope: {
      attack: 0.02,
      decay: 0.2,
      sustain: 0.2,
      release: 0.5,
    },
  });
  
  failureSynth.triggerAttackRelease(['A#4', 'G#4'], '8n', Tone.now());
  setTimeout(() => failureSynth.dispose(), 1000);
};