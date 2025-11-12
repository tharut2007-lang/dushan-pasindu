
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import ImageAnimator from './components/ImageAnimator';
import ImageEditor from './components/ImageEditor';
import VideoAnalyzer from './components/VideoAnalyzer';
import { View } from './types';
import { FEATURES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View | 'home'>(View.ImageGen);

  const renderView = () => {
    if (currentView === 'home') {
      return <HomePage setCurrentView={setCurrentView} />;
    }
    
    switch (currentView) {
      case View.ImageGen:
        return <ImageGenerator />;
      case View.VideoGen:
        return <VideoGenerator />;
      case View.ImageAnimate:
        return <ImageAnimator />;
      case View.ImageEdit:
        return <ImageEditor />;
      case View.VideoAnalyze:
        return <VideoAnalyzer />;
      default:
        return <ImageGenerator />;
    }
  };
  
  const currentFeature = FEATURES.find(f => f.id === currentView as View);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-slate-200 flex flex-col md:flex-row">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
              {currentView !== 'home' && (
                <header className="mb-6 md:hidden">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                     <span className="material-icons mr-3 text-purple-400">{currentFeature?.icon}</span>
                      {currentFeature?.title}
                  </h1>
                </header>
              )}
              {renderView()}
          </div>
      </main>
    </div>
  );
};

export default App;