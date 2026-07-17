'use client';

import { useState } from 'react';
import { fetchFromBackend } from '@/utils/api';

export default function EventUploadPage({ params }: { params: { eventId: string } }) {
    const { eventId } = params;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadStatus('Uploading...');

        try {
            // 1. Fetch the secure S3 upload URL from your Spring Boot backend
            const { uploadUrl } = await fetchFromBackend(`/s3-upload-url?eventId=${eventId}&fileName=${selectedFile.name}`);

            // 2. Upload the file directly to AWS S3 using a standard PUT request
            const s3Response = await fetch(uploadUrl, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });

            if (!s3Response.ok) {
                throw new Error('Failed to upload file to S3');
            }

            setUploadStatus('Upload successful!');
            setSelectedFile(null); // Clear the file input
        } catch (error: any) {
            console.error('Upload error:', error);
            setUploadStatus(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Upload Event Images</h1>
                
                <div className="flex flex-col space-y-4">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    
                    <button 
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${!selectedFile || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>

                    {uploadStatus && (
                        <p className={`text-center text-sm font-medium ${uploadStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                            {uploadStatus}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}