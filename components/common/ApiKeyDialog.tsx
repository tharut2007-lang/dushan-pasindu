
import React, { useState, useEffect, useCallback } from 'react';

interface ApiKeyDialogProps {
    onKeySelected: () => void;
    modelName: string;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onKeySelected, modelName }) => {
    const [isKeyRequired, setIsKeyRequired] = useState(false);

    const checkApiKey = useCallback(async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (hasKey) {
                onKeySelected();
                setIsKeyRequired(false);
            } else {
                setIsKeyRequired(true);
            }
        } else {
            console.warn('aistudio API key selection methods not found. Assuming key is set via environment variable.');
            onKeySelected();
        }
    }, [onKeySelected]);

    useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume key selection is successful and proceed.
            // A race condition can occur, but this provides a better UX.
            onKeySelected();
            setIsKeyRequired(false);
        }
    };

    if (!isKeyRequired) {
        return null;
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center shadow-2xl max-w-md mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-white">API Key Required</h2>
            <p className="text-slate-300 mb-6">
                To use the <span className="font-semibold text-purple-400">{modelName}</span> model for video generation, please select your API key. This is a mandatory step.
            </p>
            <button
                onClick={handleSelectKey}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
            >
                Select API Key
            </button>
            <p className="text-xs text-slate-500 mt-4">
                For more information on billing, visit{' '}
                <a
                    href="https://ai.google.dev/gemini-api/docs/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                >
                    ai.google.dev/gemini-api/docs/billing
                </a>.
            </p>
        </div>
    );
};

export default ApiKeyDialog;