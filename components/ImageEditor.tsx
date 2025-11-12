
import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import FileUploader from './common/FileUploader';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
      setOriginalImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedImageUrl(null);
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter an editing instruction.');
      return;
    }
    if (!originalImageFile) {
        setError('Please upload an image to edit.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);
    try {
      const url = await editImage(prompt, originalImageFile);
      setEditedImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
        <h1 className="text-3xl font-bold mb-6 hidden md:block bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">Edit Image</h1>
        <div className="flex-grow flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 flex flex-col space-y-4">
                <FileUploader onFileSelect={handleFileSelect} accept="image/*" label="image to edit" />
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Add a retro filter, or remove the person in the background."
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                    rows={4}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !originalImageFile}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Editing...' : 'Edit Image'}
                </button>
                 {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg text-center">{error}</div>}
            </div>
            <div className="lg:w-2/3 flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px] lg:min-h-0">
                <div className="bg-black/20 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-4">
                    <h3 className="font-bold mb-2 text-slate-300">Original</h3>
                     {originalImageUrl ? (
                        <img src={originalImageUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />
                     ) : (
                        <div className="text-center text-slate-500">
                             <span className="material-icons text-4xl">photo</span>
                             <p>Upload an image</p>
                        </div>
                     )}
                </div>
                 <div className="bg-black/20 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-4">
                    <h3 className="font-bold mb-2 text-slate-300">Edited</h3>
                    {isLoading && <Spinner message="Applying edits..."/>}
                    {!isLoading && editedImageUrl && (
                        <img src={editedImageUrl} alt="Edited" className="max-w-full max-h-full object-contain rounded-md" />
                    )}
                     {!isLoading && !editedImageUrl && (
                        <div className="text-center text-slate-500">
                             <span className="material-icons text-4xl">auto_fix_high</span>
                             <p>Your edited image will appear here</p>
                        </div>
                     )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ImageEditor;