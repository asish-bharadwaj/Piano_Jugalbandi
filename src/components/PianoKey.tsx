import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { playNote } from '@/utils/audioUtils';
const isTouchDevice = 'ontouchstart' in window;

interface PianoKeyProps {
  note: string;
  isBlack?: boolean;
  isPressed?: boolean;
  isDisabled?: boolean;
  onPress: (note: string) => void;
  className?: string;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isBlack = false,
  isPressed = false,
  isDisabled = false,
  onPress,
  className,
}) => {
  const [isBeingPressed, setIsBeingPressed] = useState(false);
  const [touchStarted, setTouchStarted] = useState(false);

  const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid any unwanted behaviors
    e.preventDefault();
    
    // For touch events, only handle the initial touch
    if (e.type === 'touchstart' && touchStarted) return;
    if (e.type === 'touchstart') setTouchStarted(true);

    if (!isDisabled && !isBeingPressed) {
      setIsBeingPressed(true);
      playNote(note);
      onPress(note);
    }
  };

  const handleRelease = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsBeingPressed(false);
    setTouchStarted(false);
  };

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
      onTouchEnd={(e) => handleRelease(e)}  // Changed this
      onTouchCancel={(e) => handleRelease(e)} 
      disabled={isDisabled}
      aria-label={`Piano key ${note}`}
    >
      <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-medium">
        {note}
      </span>
    </button>
  );
};

export default PianoKey;
