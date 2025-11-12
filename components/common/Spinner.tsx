
import React from 'react';

interface SpinnerProps {
    message?: string;
    progress?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ message, progress }) => {
  if (typeof progress === 'number') {
    return (
        <div className="w-full max-w-md text-center p-4">
            <p className="text-lg font-medium text-slate-200 mb-3">{message || 'Processing...'}</p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xl font-bold text-white">{`${Math.round(progress)}%`}</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      {message && <p className="text-lg text-slate-300">{message}</p>}
    </div>
  );
};

export default Spinner;