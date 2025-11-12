
import React, { useRef, useState, useCallback } from 'react';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    accept: string;
    label: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, accept, label }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
        }
    };

    const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith(accept.split('/')[0])) {
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [accept, onFileSelect]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
                className="flex justify-center w-full h-32 px-4 transition bg-slate-800/50 border-2 border-slate-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-500 focus:outline-none"
            >
                <span className="flex items-center space-x-2">
                    <span className="material-icons text-slate-500">upload_file</span>
                    <span className="font-medium text-slate-400">
                        {fileName || <>Drop your {label} here, or <span className="text-purple-400 underline">browse</span></>}
                    </span>
                </span>
                <input
                    ref={fileInputRef}
                    type="file"
                    name="file_upload"
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
};

export default FileUploader;