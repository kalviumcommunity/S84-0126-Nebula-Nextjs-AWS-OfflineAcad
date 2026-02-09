"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { validateFileUpload, formatFileSize, getUniqueFileName } from "@/lib/file-upload";
import { toast } from "react-hot-toast";

interface PDFUploadProps {
    onUploadComplete: (url: string) => void;
    currentUrl?: string | null;
}

export default function PDFUpload({ onUploadComplete, currentUrl }: PDFUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        // 1. Validate File
        const validation = validateFileUpload(file, 5 * 1024 * 1024); // 5MB limit
        if (!validation.valid) {
            toast.error(validation.error || "Invalid file");
            return;
        }

        if (validation.extension !== ".pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        try {
            setIsUploading(true);
            setProgress(0);

            // 2. Prepare for Upload
            const fileName = getUniqueFileName(file.name);

            // 3. Upload to Supabase
            const { data, error } = await supabase.storage
                .from("course-materials")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) throw error;

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from("course-materials")
                .getPublicUrl(fileName);

            // 5. Success
            toast.success("PDF uploaded successfully!");
            onUploadComplete(publicUrl);

        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload PDF");
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lesson Material (PDF)
            </label>

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors
          ${dragActive ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10" : "border-gray-300 dark:border-gray-700 hover:border-purple-400"}
          ${isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,application/pdf"
                    onChange={handleChange}
                    disabled={isUploading}
                />

                {currentUrl ? (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📄</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate max-w-xs">
                            Current File: {currentUrl.split("/").pop()}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                            Click or drag to replace
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                        <span className="text-4xl text-gray-400">☁️</span>
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs">PDF only (max 5MB)</p>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-medium text-purple-600">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>

            {currentUrl && (
                <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                    <span>🔗</span> View current PDF
                </a>
            )}
        </div>
    );
}
