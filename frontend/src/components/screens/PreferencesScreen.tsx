import React from 'react';
import { HeaderBar } from '../HeaderBar';
import { DetouristChip } from '../DetouristChip';
import { DetouristButton } from '../DetouristButton';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { RoutePreferences } from '../../types/route';
import { Check, MapPin, Navigation, Settings } from 'lucide-react';

interface PreferencesScreenProps {
  preferences: RoutePreferences;
  onUpdatePreferences: (preferences: RoutePreferences) => void;
  onBack: () => void;
  onNext: () => void;
}

export function PreferencesScreen({ 
  preferences, 
  onUpdatePreferences, 
  onBack, 
  onNext 
}: PreferencesScreenProps) {
  
  const handleChipToggle = (key: keyof RoutePreferences) => {
    if (key === 'scenic') {
      onUpdatePreferences({
        ...preferences,
        [key]: !preferences[key]
      });
    }
  };
  
  const handleSwitchChange = (key: keyof RoutePreferences, value: boolean) => {
    onUpdatePreferences({
      ...preferences,
      [key]: value
    });
  };
  
  const generateConfirmationText = () => {
    const parts = ["Got it —"];
    
    if (preferences.scenic) {
      parts.push("coastal views");
    }
    
    if (preferences.avoid) {
      parts.push(`steer clear of ${preferences.avoid}`);
    }
    
    if (preferences.calm) {
      parts.push("a relaxed drive");
    }
    
    return parts.join(" ") + ".";
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar 
        showBack 
        onBack={onBack}
      />
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-10">
          
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl tracking-tight text-foreground">
              Review your preferences
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Fine-tune your route settings before we generate your scenic journey.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Route Details Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-scenic/10 rounded-lg flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-scenic" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground">Route details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    From
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text"
                      value={preferences.origin}
                      onChange={(e) => onUpdatePreferences({
                        ...preferences, 
                        origin: e.target.value
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-input-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:border-input-focus focus:ring-1 focus:ring-input-focus transition-colors"
                      placeholder="Enter starting location"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    To
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text"
                      value={preferences.destination}
                      onChange={(e) => onUpdatePreferences({
                        ...preferences,
                        destination: e.target.value
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-input-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:border-input-focus focus:ring-1 focus:ring-input-focus transition-colors"
                      placeholder="Enter destination"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Route Preferences Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-scenic/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-scenic" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground">Route preferences</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <DetouristChip
                    type="scenic"
                    state={preferences.scenic ? 'on' : 'off'}
                    onClick={() => handleChipToggle('scenic')}
                  />
                  <DetouristChip
                    type="avoid"
                    state="beta"
                    label={`Avoid: ${preferences.avoid || 'Tenderloin'}`}
                    disabled
                  />
                  <DetouristChip
                    type="calm"
                    state="beta"
                    disabled
                  />
                </div>
                
                {/* Additional Options */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Additional options
                    </Label>
                    <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full font-medium">
                      Coming soon
                    </span>
                  </div>
                  
                  <div className="space-y-4 opacity-40">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="space-y-1">
                        <Label htmlFor="avoid-highways" className="text-sm font-medium text-muted-foreground">
                          Avoid highways
                        </Label>
                        <p className="text-xs text-muted-foreground">Take scenic back roads instead</p>
                      </div>
                      <Switch 
                        id="avoid-highways"
                        disabled
                        checked={preferences.avoidHighways}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="space-y-1">
                        <Label htmlFor="avoid-tolls" className="text-sm font-medium text-muted-foreground">
                          Avoid tolls
                        </Label>
                        <p className="text-xs text-muted-foreground">Skip toll roads when possible</p>
                      </div>
                      <Switch 
                        id="avoid-tolls"
                        disabled
                        checked={preferences.avoidTolls}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Summary Card */}
            <div className="bg-scenic-subtle border border-scenic/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-scenic rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-scenic-foreground" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-medium text-scenic">Ready to generate your route</h4>
                  <p className="text-sm text-scenic/80 leading-relaxed">
                    {generateConfirmationText()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <DetouristButton 
              variant="secondary" 
              onClick={onBack}
              className="sm:w-auto"
            >
              Back
            </DetouristButton>
            <DetouristButton 
              onClick={onNext}
              className="flex-1"
            >
              Generate scenic route
            </DetouristButton>
          </div>
        </div>
      </div>
    </div>
  );
}