import { useState } from 'react';
import { motion } from 'motion/react';
import { MapFrame } from '../MapFrame';
import { SegmentCard } from '../SegmentCard';
import { DetouristButton } from '../DetouristButton';
import { PreferencesModal } from '../PreferencesModal';
import { Share, Copy, Edit3, Clock, MapPin, Navigation, Mountain } from 'lucide-react';
import { RoutePreferences, RouteResult } from '../../types/route';

interface ResultsScreenProps {
  preferences: RoutePreferences;
  result: RouteResult;
  onBack: () => void;
  onHandoff: () => void;
  onUpdatePreferences: (preferences: RoutePreferences) => void;
}

export function ResultsScreen({ preferences, result, onBack, onHandoff, onUpdatePreferences }: ResultsScreenProps) {
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handlePreferencesSave = () => {};

  const routeStats = [
    { icon: Clock, label: 'Duration', value: result.eta },
    { icon: MapPin, label: 'Distance', value: result.distance || '120 miles' },
    { icon: Mountain, label: 'Scenic points', value: result.segments.filter(s => s.badges.some(badge => badge.type === 'scenic')).length.toString() },
  ];

  return (
    <div className="h-svh overflow-hidden flex flex-col bg-background">
      {/* Header: fixed height by content; never shrinks */}
      <div className="shrink-0 border-b border-border bg-card/50 backdrop-blur">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl transition-colors">
                <Navigation className="w-5 h-5 rotate-180" />
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{preferences.origin}</span>
                  <span>→</span>
                  <span>{preferences.destination}</span>
                </div>
                <h1 className="text-lg font-semibold text-foreground">Your scenic route</h1>
              </div>
            </div>
            <button
              onClick={() => setIsPreferencesModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main takes remaining viewport height */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Map column: fills container height, not viewport. 40vh on mobile, flexes on lg */}
        <div className="lg:w-3/5 h-[40vh] lg:h-auto lg:flex-1 min-h-0 relative p-4 lg:p-6">
          <MapFrame
            waypoints={result.waypoints}
            showRoute
            showAvoidArea={!!preferences.avoid}
            className="w-full h-full rounded-2xl overflow-hidden shadow-lg"
          />
        </div>

        {/* List column: the ONLY scroller */}
        <div className="lg:w-2/5 min-h-0 flex flex-col overflow-y-auto custom-scrollbar">
          {/* Sticky stats header inside the scroller */}
          <div className="p-6 lg:p-8 border-b border-border bg-card/95 backdrop-blur sticky top-0 z-10">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Route overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A carefully curated scenic journey with {result.segments.filter(s => s.badges.some(badge => badge.type === 'scenic')).length} scenic highlights.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {routeStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 rounded-xl bg-accent/50"
                    >
                      <div className="w-8 h-8 bg-scenic/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-4 h-4 text-scenic" />
                      </div>
                      <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1">
            <div className="p-6 lg:p-8 space-y-8">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Why this route?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your scenic route has been carefully crafted to maximize coastal views while maintaining comfortable driving conditions. Here's the detailed breakdown of each segment:
                </p>
              </div>

              <div className="space-y-6">
                {result.segments.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Step indicator */}
                    <div className="absolute -left-2 top-6 w-8 h-8 bg-scenic/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-scenic">{index + 1}</span>
                    </div>

                    <div className="ml-8">
                      <SegmentCard title={segment.title} badges={segment.badges} why={segment.why} meta={segment.meta} />
                    </div>

                    {/* Connection line */}
                    {index < result.segments.length - 1 && <div className="absolute left-1.5 top-14 w-0.5 h-12 bg-border" />}
                  </motion.div>
                ))}
              </div>

              {/* Route Summary */}
              <div className="mt-8 p-6 bg-scenic-subtle border border-scenic/20 rounded-2xl">
                <div className="space-y-3">
                  <h4 className="font-semibold text-scenic">Route highlights</h4>
                  <ul className="space-y-2 text-sm text-scenic/90">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-scenic rounded-full" />
                      <span>World-class coastal scenery for {Math.floor(result.segments.length * 0.8)} of the journey</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-scenic rounded-full" />
                      <span>{result.waypoints.length} curated photo stops and viewpoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-scenic rounded-full" />
                      <span>Balanced driving experience with minimal traffic delays</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky footer actions inside the same scroller */}
          <div className="p-6 lg:p-8 border-t border-border bg-card/95 backdrop-blur sticky bottom-0 z-10">
            <div className="space-y-4">
              <DetouristButton onClick={onHandoff} className="w-full justify-center" size="lg">
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </DetouristButton>

              <div className="flex gap-3">
                <DetouristButton variant="secondary" onClick={handleCopyLink} className="flex-1 justify-center">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </DetouristButton>
                <DetouristButton variant="secondary" className="flex-1 justify-center">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DetouristButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        preferences={preferences}
        onUpdatePreferences={onUpdatePreferences}
        onClose={() => setIsPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </div>
  );
}