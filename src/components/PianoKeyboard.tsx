import React, { useState } from 'react';
import PianoKey from './PianoKey';
import { cn } from '@/lib/utils';

interface PianoKeyboardProps {
  isRotated?: boolean;
  isDisabled?: boolean;
  onKeyPress: (note: string) => void;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [3, 4];

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  isRotated = false,
  isDisabled = false,
  onKeyPress,
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyPress = (note: string) => {
    setPressedKey(note);
    onKeyPress(note);
    setTimeout(() => setPressedKey(null), 200);
  };

  const keys = OCTAVES.flatMap(octave =>
    NOTES.map(note => ({
      note: `${note}${octave}`,
      isBlack: note.includes('#'),
    }))
  );

  return (
    <div
      className={cn(
        'flex justify-center p-4 md:p-8 transition-transform duration-300',
        isRotated && 'rotate-180'
      )}
    >
      <div className="flex relative perspective-1000">
        {keys.map(({ note, isBlack }) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={isBlack}
            isPressed={pressedKey === note}
            isDisabled={isDisabled}
            onPress={handleKeyPress}
            className="transform-style-preserve-3d"
          />
        ))}
      </div>
    </div>
  );
};

export default PianoKeyboard;