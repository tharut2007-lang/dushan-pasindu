
import React, { useState } from 'react';
import { generateVideoFromImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import FileUploader from './common/FileUploader';
import ApiKeyDialog from './common/ApiKeyDialog';

const ImageAnimator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [progress, setProgress] = useState<number | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [isKeySelected, setIsKeySelected] = useState(false);
    
    const handleProgressUpdate = (p: number, m: string) => {
        setProgress(p);
        setLoadingMessage(m);
    };

    const handleGenerate = async () => {
        if (!imageFile) {
            setError('Please upload an image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setProgress(0);
        setLoadingMessage('Initializing...');
        try {
            const url = await generateVideoFromImage(prompt, imageFile, aspectRatio, handleProgressUpdate);
            setVideoUrl(url);
        } catch (err: any) {
            let errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
             if (errorMessage.includes('Requested entity was not found.')) {
                errorMessage = "API Key error. Please re-select your key.";
                setIsKeySelected(false);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setProgress(undefined);
            setLoadingMessage('');
        }
    };

    if (!isKeySelected) {
        return <ApiKeyDialog onKeySelected={() => setIsKeySelected(true)} modelName="Veo" />;
    }

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-6 hidden md:block bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">Animate Image</h1>
            <div className="flex-grow flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 flex flex-col space-y-4">
                    <FileUploader onFileSelect={setImageFile} accept="image/*" label="image" />
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Optional: Describe the animation (e.g., make the clouds move)."
                        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                        rows={4}
                    />
                    <div className="space-y-2">
                        <label className="font-medium text-slate-300">Aspect Ratio</label>
                         <div className="flex space-x-2">
                            <button onClick={() => setAspectRatio('16:9')} className={`flex-1 p-2 rounded-md transition-colors ${aspectRatio === '16:9' ? 'bg-indigo-600 font-semibold' : 'bg-slate-700'}`}>16:9</button>
                            <button onClick={() => setAspectRatio('9:16')} className={`flex-1 p-2 rounded-md transition-colors ${aspectRatio === '9:16' ? 'bg-indigo-600 font-semibold' : 'bg-slate-700'}`}>9:16</button>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !imageFile}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Animating...' : 'Animate'}
                    </button>
                </div>
                <div className="lg:w-2/3 flex-grow bg-black/20 border border-slate-800 rounded-lg flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
                    {isLoading && <Spinner message={loadingMessage} progress={progress} />}
                    {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
                    {videoUrl && !isLoading && (
                        <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-full object-contain rounded-md" />
                    )}
                    {!isLoading && !error && !videoUrl && (
                        <div className="text-center text-slate-500">
                            <span className="material-icons text-6xl">video_spark</span>
                            <p>Your animated image will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageAnimator;