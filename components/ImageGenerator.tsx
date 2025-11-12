
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './common/Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
        <h1 className="text-3xl font-bold mb-6 hidden md:block bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">Generate Image</h1>
        <div className="flex-grow flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 flex flex-col space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A cinematic shot of a raccoon in a library, surrounded by glowing books."
                    className="w-full flex-grow p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                    rows={6}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            <div className="lg:w-2/3 flex-grow bg-black/20 border border-slate-800 rounded-lg flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
                {isLoading && <Spinner message="Creating your image..." />}
                {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt="Generated" className="max-w-full max-h-full object-contain rounded-md" />
                )}
                {!isLoading && !error && !imageUrl && (
                    <div className="text-center text-slate-500">
                        <span className="material-icons text-6xl">image</span>
                        <p>Your generated image will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ImageGenerator;