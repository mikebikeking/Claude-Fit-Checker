import React from 'react';
import { motion } from 'framer-motion';
interface Option {
  value: string;
  label: string;
}
interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}
export function SegmentedControl({
  options,
  value,
  onChange,
  label
}: SegmentedControlProps) {
  return (
    <div className="space-y-2">
      {label &&
      <label className="block text-sm font-medium text-text-muted">
          {label}
        </label>
      }
      <div className="flex p-1 bg-surface-elevated rounded-lg border border-border">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                relative flex-1 py-1.5 text-sm font-medium rounded-md transition-colors z-10
                ${isSelected ? 'text-white' : 'text-text-muted hover:text-text'}
              `}
              type="button">

              {isSelected &&
              <motion.div
                layoutId="segmented-bg"
                className="absolute inset-0 bg-zinc-600 rounded-md shadow-sm -z-10"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }} />

              }
              {option.label}
            </button>);

        })}
      </div>
    </div>);

}