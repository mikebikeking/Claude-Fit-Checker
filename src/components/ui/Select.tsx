import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Option {
  value: string;
  label: string;
}
interface SelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}
export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option'
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="space-y-2" ref={containerRef}>
      {label &&
      <label className="block text-sm font-medium text-text-muted">
          {label}
        </label>
      }
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between bg-surface border rounded-lg px-4 py-2.5 text-left
            transition-all focus:outline-none focus:ring-2 focus:ring-accent/20
            ${isOpen ? 'border-accent ring-2 ring-accent/20' : 'border-border hover:border-zinc-500'}
          `}>

          <span className={selectedOption ? 'text-text' : 'text-text-muted/50'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />

        </button>

        <AnimatePresence>
          {isOpen &&
          <motion.div
            initial={{
              opacity: 0,
              y: -10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.15
            }}
            className="absolute z-50 w-full mt-2 bg-surface-elevated border border-border rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">

              {options.map((option) =>
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                    w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                    ${option.value === value ? 'bg-accent/10 text-accent' : 'text-text hover:bg-white/5'}
                  `}>

                  {option.label}
                  {option.value === value && <Check className="w-4 h-4" />}
                </button>
            )}
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}