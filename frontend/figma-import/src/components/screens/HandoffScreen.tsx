import React from 'react';
import { HeaderBar } from '../HeaderBar';
import { DetouristButton } from '../DetouristButton';
import { ExternalLink, MapPin } from 'lucide-react';
import { RoutePreferences, RouteResult } from '../../types/route';

interface HandoffScreenProps {
  preferences: RoutePreferences;
  result: RouteResult;
  onBack: () => void;
}

export function HandoffScreen({ preferences, result, onBack }: HandoffScreenProps) {
  const scenicWaypoints = result.waypoints.filter(w => w.type === 'scenic');
  
  const handleOpenGoogleMaps = () => {
    // In a real app, this would construct a Google Maps URL with waypoints
    const waypointsParam = scenicWaypoints.map(w => `${w.lat},${w.lng}`).join('|');
    const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(preferences.origin)}/${waypointsParam}/${encodeURIComponent(preferences.destination)}`;
    
    // Open in new tab/window
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar 
        showBack 
        onBack={onBack}
      />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-lg space-y-10 text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-scenic/10 rounded-2xl flex items-center justify-center">
              <ExternalLink className="w-10 h-10 text-scenic" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-foreground">
                Ready for Google Maps
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your scenic route includes {scenicWaypoints.length} curated waypoint{scenicWaypoints.length !== 1 ? 's' : ''} for the perfect journey.
              </p>
            </div>
          </div>
          
          {/* Route summary */}
          <div className="text-left">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-medium text-foreground mb-4">Route overview</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Start</span>
                    <p className="text-sm font-medium text-foreground">{preferences.origin}</p>
                  </div>
                </div>
                
                {scenicWaypoints.map((waypoint, index) => (
                  <div key={waypoint.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-scenic/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-scenic" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Scenic stop {index + 1}</span>
                      <p className="text-sm font-medium text-foreground">{waypoint.name}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Destination</span>
                    <p className="text-sm font-medium text-foreground">{preferences.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <DetouristButton 
              onClick={handleOpenGoogleMaps}
              size="lg"
              className="w-full flex items-center justify-center gap-3"
            >
              <ExternalLink className="w-5 h-5" />
              Open in Google Maps
            </DetouristButton>
            
            <DetouristButton 
              variant="secondary"
              onClick={onBack}
              className="w-full"
            >
              Back to route
            </DetouristButton>
          </div>
        </div>
      </div>
    </div>
  );
}