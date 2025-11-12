
import React, { useState } from 'react';
import { generateVideoFromPrompt } from '../services/geminiService';
import Spinner from './common/Spinner';
import ApiKeyDialog from './common/ApiKeyDialog';

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
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
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setProgress(0);
        setLoadingMessage('Initializing...');
        try {
            const url = await generateVideoFromPrompt(prompt, aspectRatio, handleProgressUpdate);
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

    const handleDownload = () => {
        if (!videoUrl) return;
        try {
            // Create a temporary anchor to trigger download
            const a = document.createElement('a');
            a.href = videoUrl;
            // Use a friendly filename
            const filename = `sri-nova-video-${Date.now()}.mp4`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            // After a short delay revoke the object URL and clear state so the file is "deleted"
            // We can't reliably detect when the browser finishes writing the file to disk,
            // so revoke after a small timeout (3s) which is sufficient for most cases.
            setTimeout(() => {
                try {
                    URL.revokeObjectURL(videoUrl);
                } catch (e) {
                    // ignore
                }
                setVideoUrl(null);
            }, 3000);
        } catch (e) {
            console.error('Download failed', e);
        }
    };

    if (!isKeySelected) {
        return <ApiKeyDialog onKeySelected={() => setIsKeySelected(true)} modelName="Veo" />;
    }

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-6 hidden md:block bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">Generate Video</h1>
            <div className="flex-grow flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 flex flex-col space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., An astronaut riding a horse on Mars, cinematic 4K."
                        className="w-full flex-grow p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                        rows={6}
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
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                <div className="lg:w-2/3 flex-grow bg-black/20 border border-slate-800 rounded-lg flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
                    {isLoading && <Spinner message={loadingMessage} progress={progress} />}
                    {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
                    {videoUrl && !isLoading && (
                        <div className="w-full h-full flex flex-col items-center gap-4">
                            <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-[60vh] object-contain rounded-md" />
                            <div className="flex gap-3">
                                <button onClick={handleDownload} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:opacity-90 transition">
                                    Download & Remove
                                </button>
                                <button onClick={() => { URL.revokeObjectURL(videoUrl); setVideoUrl(null); }} className="px-4 py-2 border border-slate-600 text-slate-200 rounded-md hover:bg-slate-800 transition">
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                    {!isLoading && !error && !videoUrl && (
                        <div className="text-center text-slate-500">
                            <span className="material-icons text-6xl">movie</span>
                            <p>Your generated video will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoGenerator;