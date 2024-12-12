import * as React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

export function Slider({ 
  min, 
  max, 
  step = 1, 
  value, 
  onValueChange 
}: SliderProps) {
  const [isDragging, setIsDragging] = React.useState<'min' | 'max' | null>(null);

  const getPosition = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (handle: 'min' | 'max') => {
    setIsDragging(handle);
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const slider = document.getElementById('slider');
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    const newValue = Math.round((percent * (max - min) + min) / step) * step;

    if (isDragging === 'min') {
      onValueChange([Math.min(newValue, value[1] - step), value[1]]);
    } else {
      onValueChange([value[0], Math.max(newValue, value[0] + step)]);
    }
  }, [isDragging, max, min, onValueChange, step, value]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      id="slider"
      className="relative w-full h-2 bg-gray-200 rounded-full cursor-pointer"
    >
      <div
        className="absolute h-full bg-indigo-600 rounded-full"
        style={{
          left: `${getPosition(value[0])}%`,
          right: `${100 - getPosition(value[1])}%`
        }}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full 
                 -mt-1.5 cursor-grab active:cursor-grabbing"
        style={{ left: `${getPosition(value[0])}%` }}
        onMouseDown={() => handleMouseDown('min')}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-indigo-600 rounded-full 
                 -mt-1.5 cursor-grab active:cursor-grabbing"
        style={{ left: `${getPosition(value[1])}%` }}
        onMouseDown={() => handleMouseDown('max')}
      />
    </div>
  );
}