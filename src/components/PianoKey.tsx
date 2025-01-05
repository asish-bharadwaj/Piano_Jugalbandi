import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { playNote } from '@/utils/audioUtils';

interface PianoKeyProps {
  note: string;
  isBlack?: boolean;
  isPressed?: boolean;
  isDisabled?: boolean;
  onPress: (note: string) => void;
  className?: string;
  isRotated?: boolean;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isBlack = false,
  isPressed = false,
  isDisabled = false,
  onPress,
  className,
  isRotated = false,
}) => {
  const [isBeingPressed, setIsBeingPressed] = useState(false);
  const [touchStarted, setTouchStarted] = useState(false);

  const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (e.type === 'touchstart' && touchStarted) return;
    if (e.type === 'touchstart') setTouchStarted(true);

    if (!isDisabled && !isBeingPressed) {
      setIsBeingPressed(true);
      playNote(note);
      onPress(note);
    }
  };

  const handleRelease = () => {
    setIsBeingPressed(false);
    setTouchStarted(false);
  };

  const keyLabelStyle = cn(
    "absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold",
    isBlack ? "text-white" : "text-black",
    isRotated 
      ? isBlack ? "top-2" : "top-4"  // For Player 1 (top keyboard)
      : isBlack ? "bottom-2" : "bottom-4"  // For Player 2 (bottom keyboard)
  );

  return (
    <button
      className={cn(
        'relative transition-all duration-100 select-none',
        isBlack
          ? 'bg-piano-black text-white h-32 w-12 -mx-6 z-10 hover:bg-opacity-90 shadow-lg transform hover:translate-y-1 active:translate-y-2'
          : 'bg-piano-white text-black h-48 w-16 hover:bg-opacity-90 shadow-lg transform hover:translate-y-1 active:translate-y-2',
        (isPressed || isBeingPressed) && 'translate-y-2 shadow-sm',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onTouchCancel={handleRelease}
      disabled={isDisabled}
      aria-label={`Piano key ${note}`}
    >
      <span 
        className={keyLabelStyle}
        style={{ transform: isRotated ? 'translate(-50%) rotate(180deg)' : 'translate(-50%)' }}
      >
        {note === 'C4' ? 'S' : 
         note === 'D4' ? 'R2' : 
         note === 'E4' ? 'G2' : 
         note === 'F4' ? 'M1' :  
         note === 'G4' ? 'P' : 
         note === 'A4' ? 'D2' : 
         note === 'B4' ? 'N2' : 
         note === 'C#4' ? 'R1' : 
         note === 'D#4' ? 'G1' : 
         note === 'F#4' ? 'M2' : 
         note === 'G#4' ? 'D1' : 
         note === 'A#4' ? 'N1' : 
         note === 'C5' ? 'Ṡ' : 
         note === 'D5' ? 'Ṙ2' : 
         note === 'E5' ? 'Ġ2' : 
         note === 'F5' ? 'Ṁ1' :  
         note === 'G5' ? 'Ṗ' : 
         note === 'A5' ? 'Ḋ2' : 
         note === 'B5' ? 'Ṅ2' : 
         note === 'C#5' ? 'Ṙ1' : 
         note === 'D#5' ? 'Ġ1' : 
         note === 'F#5' ? 'Ṁ2' : 
         note === 'G#5' ? 'Ḋ1' : 
         note === 'A#5' ? 'Ṅ1' : note
        }
      </span>
    </button>
  );
};

export default PianoKey;
