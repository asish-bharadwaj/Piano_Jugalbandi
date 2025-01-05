import React, { useState, useCallback } from 'react';
import PianoKey from './PianoKey';
import { cn } from '@/lib/utils';

interface PianoKeyboardProps {
  isRotated?: boolean;
  isDisabled?: boolean;
  onKeyPress: (note: string) => void;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [4, 5];

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  isRotated = false,
  isDisabled = false,
  onKeyPress,
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleKeyPress = useCallback((note: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setPressedKey(note);
    onKeyPress(note);
    
    setTimeout(() => {
      setPressedKey(null);
      setIsProcessing(false);
    }, 300);
  }, [onKeyPress, isProcessing]);

  const keys = OCTAVES.flatMap(octave =>
    NOTES.map(note => ({
      note: `${note}${octave}`,
      isBlack: note.includes('#'),
    }))
  );

  return (
    <div
      className={cn(
        'flex justify-center p-2 md:p-4 transition-transform duration-300 overflow-x-auto max-w-full',
        isRotated && 'rotate-180'
      )}
    >
      <div className="flex relative perspective-1000 min-w-fit scale-75 md:scale-100">
        {keys.map(({ note, isBlack }) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={isBlack}
            isPressed={pressedKey === note}
            isDisabled={isDisabled}
            onPress={handleKeyPress}
            className={cn(
              "transform-style-preserve-3d",
              isRotated && "rotate-180"
            )}
            isRotated={isRotated}
          />
        ))}
      </div>
    </div>
  );
};

export default PianoKeyboard;