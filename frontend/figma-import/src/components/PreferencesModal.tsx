import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Settings, Check } from 'lucide-react';
import { DetouristChip } from './DetouristChip';
import { DetouristButton } from './DetouristButton';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { RoutePreferences } from '../types/route';

interface PreferencesModalProps {
  isOpen: boolean;
  preferences: RoutePreferences;
  onUpdatePreferences: (preferences: RoutePreferences) => void;
  onClose: () => void;
  onSave: () => void;
}

export function PreferencesModal({ 
  isOpen,
  preferences, 
  onUpdatePreferences, 
  onClose,
  onSave
}: PreferencesModalProps) {
  
  const handleChipToggle = (key: keyof RoutePreferences) => {
    if (key === 'scenic') {
      onUpdatePreferences({
        ...preferences,
        [key]: !preferences[key]
      });
    }
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

  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:h-auto bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-scenic/10 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-scenic" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">Edit preferences</h2>
                  <p className="text-sm text-muted-foreground">Customize your route settings</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Route Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-scenic/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-scenic" />
                  </div>
                  <h3 className="font-medium text-card-foreground">Route details</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      From
                    </Label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={preferences.origin}
                        onChange={(e) => onUpdatePreferences({
                          ...preferences, 
                          origin: e.target.value
                        })}
                        className="w-full px-3 py-2.5 border border-input-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:border-input-focus focus:ring-1 focus:ring-input-focus transition-colors"
                        placeholder="Enter starting location"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      To
                    </Label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={preferences.destination}
                        onChange={(e) => onUpdatePreferences({
                          ...preferences,
                          destination: e.target.value
                        })}
                        className="w-full px-3 py-2.5 border border-input-border rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground focus:border-input-focus focus:ring-1 focus:ring-input-focus transition-colors"
                        placeholder="Enter destination"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Route Preferences */}
              <div className="space-y-4">
                <h3 className="font-medium text-card-foreground">Route preferences</h3>
                
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
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Additional options
                    </Label>
                    <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full font-medium">
                      Coming soon
                    </span>
                  </div>
                  
                  <div className="space-y-3 opacity-40">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="space-y-1">
                        <Label htmlFor="avoid-highways-modal" className="text-sm font-medium text-muted-foreground">
                          Avoid highways
                        </Label>
                        <p className="text-xs text-muted-foreground">Take scenic back roads instead</p>
                      </div>
                      <Switch 
                        id="avoid-highways-modal"
                        disabled
                        checked={preferences.avoidHighways}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="space-y-1">
                        <Label htmlFor="avoid-tolls-modal" className="text-sm font-medium text-muted-foreground">
                          Avoid tolls
                        </Label>
                        <p className="text-xs text-muted-foreground">Skip toll roads when possible</p>
                      </div>
                      <Switch 
                        id="avoid-tolls-modal"
                        disabled
                        checked={preferences.avoidTolls}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Summary */}
              <div className="bg-scenic-subtle border border-scenic/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-scenic rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-scenic-foreground" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-medium text-scenic">Updated preferences</h4>
                    <p className="text-xs text-scenic/80 leading-relaxed">
                      {generateConfirmationText()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-border">
              <DetouristButton 
                variant="secondary" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </DetouristButton>
              <DetouristButton 
                onClick={handleSave}
                className="flex-1"
              >
                Save changes
              </DetouristButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}