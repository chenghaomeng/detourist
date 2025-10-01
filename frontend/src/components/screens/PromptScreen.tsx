import React, { useState, useEffect } from 'react';
import { DetouristTextInput } from '../DetouristTextInput';
import { DetouristButton } from '../DetouristButton';
import { placeholderPrompts } from '../../data/sampleData';

interface PromptScreenProps {
  onNext: (prompt: string) => void;
}

export function PromptScreen({ onNext }: PromptScreenProps) {
  const [prompt, setPrompt] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  
  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderPrompts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onNext(prompt);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Detourist</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight">
              Plan a drive you'll remember.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Discover scenic routes and hidden gems along your journey.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <DetouristTextInput
                placeholder={placeholderPrompts[currentPlaceholder]}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="text-lg resize-none border-0 shadow-none bg-transparent focus:ring-0 focus:border-0 p-0"
              />
            </div>
            
            <div className="text-center space-y-6">
              <p className="text-muted-foreground">
                We'll highlight scenic roads and explain why they're special.
              </p>
              
              <DetouristButton 
                type="submit" 
                size="lg"
                disabled={!prompt.trim()}
                className="w-full sm:w-auto px-16 py-4 text-base"
              >
                Plan route
              </DetouristButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}