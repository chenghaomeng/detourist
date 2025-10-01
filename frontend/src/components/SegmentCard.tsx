import React from 'react';
import { DetouristBadge } from './DetouristBadge';
import { cn } from './ui/utils';

interface SegmentCardProps {
  title: string;
  badges: Array<{
    type: 'scenic' | 'avoid' | 'calm' | 'faster' | 'slower';
    label: string;
  }>;
  why: string;
  meta?: string;
  className?: string;
}

export function SegmentCard({ title, badges, why, meta, className }: SegmentCardProps) {
  return (
    <div className={cn(
      "group p-6 rounded-2xl border border-border bg-card hover:border-scenic/20 hover:shadow-lg transition-all duration-300 space-y-5",
      className
    )}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-foreground text-lg leading-tight flex-1">{title}</h3>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {badges.map((badge, index) => (
                <DetouristBadge key={index} type={badge.type}>
                  {badge.label}
                </DetouristBadge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-foreground/90 leading-relaxed">
          {why}
        </p>
        
        {meta && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <div className="w-1.5 h-1.5 bg-scenic rounded-full"></div>
            <p className="text-sm text-muted-foreground font-medium">
              {meta}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}