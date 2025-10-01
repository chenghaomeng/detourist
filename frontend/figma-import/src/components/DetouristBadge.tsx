import React from 'react';
import { cn } from './ui/utils';

interface DetouristBadgeProps {
  type: 'scenic' | 'avoid' | 'calm' | 'faster' | 'slower';
  children: React.ReactNode;
  className?: string;
}

export function DetouristBadge({ type, children, className }: DetouristBadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
  
  const typeStyles = {
    scenic: "bg-scenic/10 text-scenic border border-scenic/20",
    avoid: "bg-destructive/10 text-destructive border border-destructive/20",
    calm: "bg-accent text-accent-foreground border border-border",
    faster: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    slower: "bg-amber-50 text-amber-700 border border-amber-200"
  };
  
  return (
    <span className={cn(baseStyles, typeStyles[type], className)}>
      {children}
    </span>
  );
}