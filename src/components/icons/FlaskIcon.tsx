import { BeakerIcon } from 'lucide-react';

interface FlaskIconProps {
  className?: string;
}

export function FlaskIcon({ className }: FlaskIconProps) {
  // Используем BeakerIcon как альтернативу Flask, так как она лучше подходит
  // для отображения лабораторной/химической тематики
  return <BeakerIcon className={className} />;
}