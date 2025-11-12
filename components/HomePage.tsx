import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { FEATURES } from '../constants';

interface HomePageProps {
  setCurrentView: (view: View | 'home') => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Stagger animation for features
    FEATURES.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFeatures(prev => [...prev, index]);
      }, index * 100);
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-4xl mx-auto animate-fadeInUp">
            {/* Logo Animation */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-75 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-6xl text-white">auto_awesome</span>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-fadeInDown">
              Sri Nova
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-slate-300 mb-8 animate-fadeInUp animation-delay-200 leading-relaxed">
              Experience the power of AI-driven creativity
            </p>

            {/* Description */}
            <p className="text-sm md:text-base text-slate-400 mb-12 animate-fadeInUp animation-delay-300 max-w-2xl mx-auto">
              Transform images, generate videos, animate content, and analyze media with cutting-edge AI technology. All in one beautiful suite.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp animation-delay-400">
              <button
                onClick={() => setCurrentView(View.ImageGen)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              >
                <span className="material-icons mr-2 group-hover:rotate-12 transition-transform duration-300">play_circle</span>
                Get Started
              </button>
              <button
                className="px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 hover:border-purple-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              >
                <span className="material-icons mr-2">help_outline</span>
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-4 py-12 animate-fadeInUp animation-delay-500">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Powerful Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.id}
                  onClick={() => setCurrentView(feature.id)}
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-purple-500 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden ${
                    visibleFeatures.includes(index) ? 'animate-fadeInUp' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                      <span className="material-icons text-white text-2xl">{feature.icon}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4 group-hover:text-slate-300 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Arrow */}
                    <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                      <span className="text-sm font-semibold">Explore</span>
                      <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-slate-800 text-slate-500 text-sm animate-fadeIn animation-delay-700">
          <p>Powered by Google Gemini AI • © 2025 Sri Nova</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
