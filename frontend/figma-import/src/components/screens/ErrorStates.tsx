import React from 'react';
import { HeaderBar } from '../HeaderBar';
import { MapFrame } from '../MapFrame';
import { DetouristButton } from '../DetouristButton';
import { DetouristBanner } from '../DetouristBanner';
import { DetouristChip } from '../DetouristChip';
import { RoutePreferences } from '../../types/route';

interface NoScenicStateProps {
  preferences: RoutePreferences;
  onBack: () => void;
  onHandoff: () => void;
}

export function NoScenicState({ preferences, onBack, onHandoff }: NoScenicStateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar 
        showBack 
        onBack={onBack}
        origin={preferences.origin}
        destination={preferences.destination}
        eta="2h 36m"
        comparison="fastest route"
      />
      
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <DetouristBanner type="info">
            We couldn't find notable scenic segments. Showing best available route.
          </DetouristBanner>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MapFrame 
              showRoute
              className="h-64 lg:h-80"
            />
            
            <div className="space-y-4">
              <h2 className="text-lg">Route</h2>
              
              <div className="p-4 rounded-lg border border-border bg-card space-y-3">
                <div className="space-y-2">
                  <h3>Direct Route via US-101</h3>
                  <div className="flex flex-wrap gap-2">
                    <DetouristChip type="scenic" state="off" disabled />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Standard routing along major highways. No significant scenic viewpoints identified for this route.
                </p>
              </div>
              
              <DetouristButton onClick={onHandoff} className="w-full">
                Open in Google Maps
              </DetouristButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConflictStateProps {
  preferences: RoutePreferences;
  onBack: () => void;
  onRelaxAvoid: () => void;
  onRemoveAvoid: () => void;
}

export function ConflictState({ preferences, onBack, onRelaxAvoid, onRemoveAvoid }: ConflictStateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar 
        showBack 
        onBack={onBack}
        origin={preferences.origin}
        destination={preferences.destination}
      />
      
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <DetouristBanner type="warning" title="Route conflict">
            Your avoid area blocks all routes. Please adjust your preferences to continue.
          </DetouristBanner>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MapFrame 
              showAvoidArea
              showRoute={false}
              className="h-64 lg:h-80"
            />
            
            <div className="space-y-4">
              <h2 className="text-lg">Conflicting preferences</h2>
              
              <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-3">
                <div className="space-y-2">
                  <h3>Cannot route around avoid area</h3>
                  <div className="flex flex-wrap gap-2">
                    <DetouristChip 
                      type="avoid" 
                      state="on" 
                      label={`Avoid: ${preferences.avoid}`}
                      disabled 
                    />
                  </div>
                </div>
                <p className="text-destructive text-sm">
                  The specified avoid area encompasses all possible routes between your origin and destination.
                </p>
              </div>
              
              <div className="space-y-3">
                <DetouristButton onClick={onRelaxAvoid} className="w-full">
                  Relax avoid constraints
                </DetouristButton>
                <DetouristButton 
                  variant="secondary" 
                  onClick={onRemoveAvoid}
                  className="w-full"
                >
                  Remove avoid area
                </DetouristButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}