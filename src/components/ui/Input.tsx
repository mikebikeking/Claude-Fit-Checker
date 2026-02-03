import React, { useId } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || useId();
  return (
    <div className="w-full space-y-2">
      {label &&
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-text-muted">

          {label}
        </label>
      }
      <div className="relative">
        <input
          id={inputId}
          className={`
            w-full bg-surface border rounded-lg px-4 py-2.5 text-text placeholder-text-muted/50
            transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
            ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border'}
            ${className}
          `}
          {...props} />

      </div>
      {error && <p className="text-xs text-error">{error}</p>}
      {helperText && !error &&
      <p className="text-xs text-text-muted">{helperText}</p>
      }
    </div>);

}