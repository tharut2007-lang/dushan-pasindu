
import React, { useState } from 'react';
import { View } from '../types';
import { FEATURES } from '../constants';

interface NavbarProps {
  currentView: View | 'home';
  setCurrentView: (view: View | 'home') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900/70 backdrop-blur-lg md:w-64 p-4 flex md:flex-col shrink-0 border-b md:border-b-0 md:border-r border-slate-800 transition-all duration-300">
      <div className="flex items-center justify-between md:block w-full">
        <div 
          className="flex items-center mb-0 md:mb-8 shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setCurrentView('home')}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
              <span className="material-icons text-2xl text-white">auto_awesome_mosaic</span>
          </div>
          <h1 className="text-lg font-bold ml-3 bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text hover:from-indigo-400 hover:to-purple-400 transition-all duration-300">Sri Nova</h1>
        </div>

        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>
      <ul className={`flex flex-col space-y-2 w-full transition-all duration-300 ${isOpen ? 'flex mt-4 md:mt-0' : 'hidden md:flex'}`}>
        {FEATURES.map((feature, index) => (
          <li key={feature.id} style={{ animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none' }}>
            <button
              onClick={() => {
                setCurrentView(feature.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] group relative overflow-hidden text-sm md:text-base ${
                currentView === feature.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="material-icons relative z-10 text-xl">{feature.icon}</span>
              <span className="ml-4 font-medium relative z-10 whitespace-nowrap">{feature.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;