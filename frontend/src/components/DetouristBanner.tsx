import React from 'react';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from './ui/utils';

interface DetouristBannerProps {
  type: 'info' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DetouristBanner({ type, title, children, className }: DetouristBannerProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle
  };
  
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800", 
    error: "bg-red-50 border-red-200 text-red-800"
  };
  
  const Icon = icons[type];
  
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg border",
      styles[type],
      className
    )}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && (
          <div className="text-sm font-medium">
            {title}
          </div>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}