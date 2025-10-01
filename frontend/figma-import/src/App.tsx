import React, { useState } from 'react';
import { PromptScreen } from './components/screens/PromptScreen';
import { ProcessingScreen } from './components/screens/ProcessingScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { HandoffScreen } from './components/screens/HandoffScreen';
import { NoScenicState, ConflictState } from './components/screens/ErrorStates';
import { RoutePreferences, AppScreen } from './types/route';
import { samplePreferences, sampleRouteResult } from './data/sampleData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('prompt');
  const [userPrompt, setUserPrompt] = useState('');
  const [preferences, setPreferences] = useState<RoutePreferences>(samplePreferences);
  
  // Mock route generation logic
  const generateRoute = () => {
    // Simulate different outcomes based on preferences
    if (!preferences.scenic && preferences.avoid) {
      return 'conflict';
    }
    if (!preferences.scenic) {
      return 'no-scenic';
    }
    return 'results';
  };
  
  const handlePromptSubmit = (prompt: string) => {
    setUserPrompt(prompt);
    
    // Parse prompt and update preferences (mock implementation)
    const lowerPrompt = prompt.toLowerCase();
    const updatedPreferences = { ...samplePreferences };
    
    if (lowerPrompt.includes('big sur')) {
      updatedPreferences.destination = 'Big Sur, CA';
    }
    if (lowerPrompt.includes('monterey')) {
      updatedPreferences.destination = 'Monterey, CA';
    }
    if (lowerPrompt.includes('napa')) {
      updatedPreferences.destination = 'Napa, CA';
    }
    if (lowerPrompt.includes('avoid downtown')) {
      updatedPreferences.avoid = 'Downtown';
    }
    if (lowerPrompt.includes('chill') || lowerPrompt.includes('calm') || lowerPrompt.includes('peaceful')) {
      updatedPreferences.calm = true;
    }
    
    setPreferences(updatedPreferences);
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = () => {
    const nextScreen = generateRoute();
    setCurrentScreen(nextScreen as AppScreen);
  };
  
  const handleBackToPrompt = () => {
    setCurrentScreen('prompt');
  };
  
  const handleBackToResults = () => {
    setCurrentScreen('results');
  };
  
  const handleHandoff = () => {
    setCurrentScreen('handoff');
  };
  
  const handleRelaxAvoid = () => {
    setPreferences({
      ...preferences,
      avoid: undefined
    });
    setCurrentScreen('results');
  };
  
  const handleRemoveAvoid = () => {
    setPreferences({
      ...preferences,
      avoid: undefined
    });
    setCurrentScreen('results');
  };
  
  // Screen routing
  switch (currentScreen) {
    case 'prompt':
      return <PromptScreen onNext={handlePromptSubmit} />;
      
    case 'processing':
      return (
        <ProcessingScreen
          prompt={userPrompt}
          preferences={preferences}
          onComplete={handleProcessingComplete}
        />
      );
      
    case 'results':
      return (
        <ResultsScreen
          preferences={preferences}
          result={sampleRouteResult}
          onBack={handleBackToPrompt}
          onHandoff={handleHandoff}
          onUpdatePreferences={setPreferences}
        />
      );
      
    case 'handoff':
      return (
        <HandoffScreen
          preferences={preferences}
          result={sampleRouteResult}
          onBack={() => setCurrentScreen('results')}
        />
      );
      
    case 'no-scenic':
      return (
        <NoScenicState
          preferences={preferences}
          onBack={handleBackToResults}
          onHandoff={handleHandoff}
        />
      );
      
    case 'conflict':
      return (
        <ConflictState
          preferences={preferences}
          onBack={handleBackToResults}
          onRelaxAvoid={handleRelaxAvoid}
          onRemoveAvoid={handleRemoveAvoid}
        />
      );
      
    default:
      return <PromptScreen onNext={handlePromptSubmit} />;
  }
}