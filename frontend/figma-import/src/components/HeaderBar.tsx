import React from 'react';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import { cn } from './ui/utils';

interface HeaderBarProps {
  origin?: string;
  destination?: string;
  eta?: string;
  comparison?: string;
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
}

export function HeaderBar({ 
  origin, 
  destination, 
  eta, 
  comparison, 
  onBack, 
  showBack = false,
  className 
}: HeaderBarProps) {
  return (
    <div className={cn(
      "flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm",
      className
    )}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2.5 hover:bg-accent rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {origin && destination && (
          <div className="flex items-center gap-2">
            <span className="text-sm truncate max-w-32 sm:max-w-none">
              {origin}
            </span>
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm truncate max-w-32 sm:max-w-none">
              {destination}
            </span>
          </div>
        )}
      </div>
      
      {(eta || comparison) && (
        <div className="text-right">
          {eta && (
            <div className="text-sm">
              {eta}
            </div>
          )}
          {comparison && (
            <div className="text-xs text-muted-foreground">
              {comparison}
            </div>
          )}
        </div>
      )}
    </div>
  );
}