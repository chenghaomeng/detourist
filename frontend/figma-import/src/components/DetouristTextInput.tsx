import React from 'react';
import { cn } from './ui/utils';

interface DetouristTextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error';
}

export function DetouristTextInput({ 
  label,
  error, 
  helperText,
  variant = 'default',
  className,
  ...props 
}: DetouristTextInputProps) {
  const inputVariant = error ? 'error' : variant;
  
  const baseStyles = "w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 shadow-sm";
  
  const variants = {
    default: "border-input-border bg-input-background hover:border-input-focus focus:border-input-focus focus:shadow-md",
    error: "border-destructive bg-destructive/5 focus:border-destructive focus:shadow-md"
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          baseStyles,
          variants[inputVariant],
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn(
          "text-sm",
          error ? "text-destructive" : "text-muted-foreground"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}