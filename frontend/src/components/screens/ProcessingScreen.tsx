import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, MapPin, Navigation, Settings, Sparkles } from 'lucide-react';
import { RoutePreferences } from '../../types/route';

interface ProcessingScreenProps {
  prompt: string;
  preferences: RoutePreferences;
  onComplete: () => void;
}

interface ProcessingStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}

const processingSteps: ProcessingStep[] = [
  {
    id: 'parsing',
    label: 'Understanding your request...',
    icon: Sparkles,
    delay: 800
  },
  {
    id: 'route',
    label: 'Extracting route details',
    icon: MapPin,
    delay: 1200
  },
  {
    id: 'preferences',
    label: 'Identifying scenic preferences',
    icon: Settings,
    delay: 1600
  },
  {
    id: 'generating',
    label: 'Generating your scenic route',
    icon: Navigation,
    delay: 2000
  }
];

export function ProcessingScreen({ prompt, preferences, onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Start the processing sequence
    processingSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step.id]);
          if (index === processingSteps.length - 1) {
            setTimeout(() => {
              setShowPreferences(true);
              setTimeout(() => {
                onComplete();
              }, 1500);
            }, 500);
          }
        }, 400);
      }, step.delay);
    });
  }, [onComplete]);

  const extractedPreferences = [
    { label: 'Origin', value: preferences.origin },
    { label: 'Destination', value: preferences.destination },
    ...(preferences.scenic ? [{ label: 'Scenic routes', value: 'Preferred' }] : []),
    ...(preferences.avoid ? [{ label: 'Avoid', value: preferences.avoid }] : []),
    ...(preferences.calm ? [{ label: 'Style', value: 'Calm drive' }] : [])
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-scenic/10 rounded-2xl flex items-center justify-center mx-auto"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-scenic" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-foreground"
          >
            Analyzing your request
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-sm italic"
          >
            "{prompt}"
          </motion.p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {processingSteps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isActive || isCompleted ? 1 : 0.3,
                  x: 0 
                }}
                transition={{ delay: step.delay / 1000 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-scenic/5 border-scenic/20' 
                    : isCompleted 
                    ? 'bg-card border-border' 
                    : 'bg-muted/30 border-border/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-scenic text-scenic-foreground' 
                    : isActive 
                    ? 'bg-scenic/20 text-scenic' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium transition-colors ${
                    isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </p>
                </div>
                
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex space-x-1"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="w-1.5 h-1.5 bg-scenic rounded-full"
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Extracted Preferences */}
        <AnimatePresence>
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-scenic/10 rounded-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-scenic" />
                </div>
                <h3 className="font-medium text-foreground">Route preferences identified</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extractedPreferences.map((pref, index) => (
                  <motion.div
                    key={pref.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-accent/50 rounded-lg"
                  >
                    <span className="text-sm text-muted-foreground">{pref.label}</span>
                    <span className="text-sm font-medium text-foreground">{pref.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}