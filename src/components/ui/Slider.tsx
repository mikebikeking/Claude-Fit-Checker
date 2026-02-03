import React from 'react';
interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => v.toString()
}: SliderProps) {
  const percentage = (value - min) / (max - min) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        {label &&
        <label className="text-sm font-medium text-text-muted">{label}</label>
        }
        <span className="text-sm font-mono text-accent">
          {formatValue(value)}
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-150"
            style={{
              width: `${percentage}%`
            }} />

        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer" />

        <div
          className="absolute h-4 w-4 bg-white rounded-full shadow-lg border border-zinc-200 pointer-events-none transition-all duration-150"
          style={{
            left: `calc(${percentage}% - 8px)`
          }} />

      </div>
    </div>);

}