
import React, { useState, useRef } from 'react';
import { analyzeVideoFrame } from '../services/geminiService';
import Spinner from './common/Spinner';
import FileUploader from './common/FileUploader';

const VideoAnalyzer: React.FC = () => {
    const [prompt, setPrompt] = useState('Analyze this video frame and describe what is happening.');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoFrameUrl, setVideoFrameUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const captureFrame = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const frameUrl = canvas.toDataURL('image/jpeg');
                setVideoFrameUrl(frameUrl);
            }
        }
    };

    const handleFileSelect = (file: File) => {
        setVideoFile(file);
        setVideoFrameUrl(null);
        setAnalysis(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (!videoFrameUrl) {
            setError('Please capture a frame from the video first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const base64Data = videoFrameUrl.split(',')[1];
            const result = await analyzeVideoFrame(prompt, base64Data);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-6 hidden md:block bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">Analyze Video</h1>
            <div className="flex-grow flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/5 flex flex-col space-y-4">
                    <FileUploader onFileSelect={handleFileSelect} accept="video/*" label="video" />
                    {videoFile && (
                        <div className="space-y-2">
                             <video
                                ref={videoRef}
                                src={URL.createObjectURL(videoFile)}
                                onLoadedData={captureFrame}
                                className="w-full rounded-lg"
                                controls
                                muted
                             />
                             <p className="text-sm text-slate-400">First frame of the video is captured for analysis.</p>
                        </div>
                    )}
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your analysis prompt."
                        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                        rows={4}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !videoFrameUrl}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Frame'}
                    </button>
                </div>
                <div className="lg:w-3/5 flex-grow bg-black/20 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-6 min-h-[300px] lg:min-h-0">
                    {isLoading && <Spinner message="Analyzing video frame..." />}
                    {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
                    {analysis && !isLoading && (
                        <div className="prose prose-invert max-w-none w-full text-slate-200 whitespace-pre-wrap">{analysis}</div>
                    )}
                    {!isLoading && !error && !analysis && (
                        <div className="text-center text-slate-500">
                             <span className="material-icons text-6xl">search</span>
                             <p>Your video analysis will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoAnalyzer;