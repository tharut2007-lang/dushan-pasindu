
import { GoogleGenAI, Modality } from "@google/genai";

const VEO_POLLING_INTERVAL = 5000; // 5 seconds
const VEO_ESTIMATED_DURATION_MS = 120 * 1000; // 2 minutes

// Utility to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

export const generateImage = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API key not found");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("Image generation failed.");
};

const pollVeoOperation = async (ai: GoogleGenAI, initialOperation: any, onProgress: (progress: number, message: string) => void): Promise<any> => {
    let operation = initialOperation;
    const startTime = Date.now();
    onProgress(5, "Processing request...");

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, VEO_POLLING_INTERVAL));
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(95, 5 + (elapsedTime / VEO_ESTIMATED_DURATION_MS) * 90);
        onProgress(progress, "Generating video... This may take a few minutes.");
        operation = await ai.operations.getVideosOperation({ operation });
    }

    if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        onProgress(98, "Finalizing and fetching video...");
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) throw new Error('Failed to download video.');
        const videoBlob = await videoResponse.blob();
        onProgress(100, "Done!");
        return URL.createObjectURL(videoBlob);
    }
    
    throw new Error("Video generation failed or returned no content.");
}


export const generateVideoFromPrompt = async (prompt: string, aspectRatio: '16:9' | '9:16', onProgress: (progress: number, message: string) => void): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API key not found");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    onProgress(1, "Initializing video generation...");
    const initialOperation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    return pollVeoOperation(ai, initialOperation, onProgress);
};


export const generateVideoFromImage = async (prompt: string, imageFile: File, aspectRatio: '16:9' | '9:16', onProgress: (progress: number, message: string) => void): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API key not found");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    onProgress(1, "Preparing image for animation...");
    const imageBase64 = await fileToBase64(imageFile);

    onProgress(3, "Initializing animation...");
    const initialOperation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        image: {
            imageBytes: imageBase64,
            mimeType: imageFile.type,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
        }
    });
    
    return pollVeoOperation(ai, initialOperation, onProgress);
};

export const editImage = async (prompt: string, imageFile: File): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API key not found");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imageBase64 = await fileToBase64(imageFile);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: imageFile.type,
                    },
                },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }

    throw new Error("Image editing failed.");
};

export const analyzeVideoFrame = async (prompt: string, imageBase64: string): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API key not found");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [
                {
                    text: prompt,
                },
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: imageBase64,
                    },
                },
            ]
        },
    });

    return response.text;
};