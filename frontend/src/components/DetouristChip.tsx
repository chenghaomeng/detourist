import React from 'react';
import { cn } from './ui/utils';

interface DetouristChipProps {
  type: 'scenic' | 'avoid' | 'calm';
  state: 'on' | 'off' | 'beta';
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function DetouristChip({ 
  type, 
  state, 
  label,
  onClick, 
  disabled = false 
}: DetouristChipProps) {
  const isInteractive = !disabled && state !== 'beta' && onClick;
  const isBeta = state === 'beta';
  
  const baseStyles = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const typeStyles = {
    scenic: {
      on: "bg-scenic text-scenic-foreground shadow-sm hover:shadow-md",
      off: "bg-card text-muted-foreground border border-border hover:border-scenic/30 hover:bg-scenic/5",
      beta: "bg-muted/60 text-muted-foreground border border-border/60"
    },
    avoid: {
      on: "bg-destructive/10 text-destructive border border-destructive/20 shadow-sm",
      off: "bg-card text-muted-foreground border border-border hover:border-destructive/30 hover:bg-destructive/5", 
      beta: "bg-muted/60 text-muted-foreground border border-border/60"
    },
    calm: {
      on: "bg-accent text-accent-foreground border border-border shadow-sm",
      off: "bg-card text-muted-foreground border border-border hover:border-accent hover:bg-accent/50",
      beta: "bg-muted/60 text-muted-foreground border border-border/60"
    }
  };
  
  const getLabel = () => {
    if (label) return label;
    
    const baseLabels = {
      scenic: 'Scenic',
      avoid: 'Avoid',
      calm: 'Calm'
    };
    
    return baseLabels[type];
  };
  
  const displayLabel = getLabel() + (isBeta ? ' (beta)' : '');
  
  return (
    <button
      className={cn(
        baseStyles,
        typeStyles[type][state],
        isInteractive ? "cursor-pointer active:scale-95" : "cursor-default",
        disabled && "opacity-50"
      )}
      onClick={isInteractive ? onClick : undefined}
      disabled={disabled}
      type="button"
    >
      {displayLabel}
    </button>
  );
}