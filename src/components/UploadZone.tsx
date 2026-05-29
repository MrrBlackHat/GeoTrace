/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent } from 'react';
import { UploadCloud, FileSpreadsheet, AlertTriangle, RefreshCw } from 'lucide-react';

interface UploadZoneProps {
  onUploadSuccess: (id: string, imageUrl: string, exifData: any) => void;
  isLoading: boolean;
}

export default function UploadZone({ onUploadSuccess, isLoading }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    // 1. Client-Side image type validation
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimes.includes(file.type)) {
      setErrorStatus('Security Exception: Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // 2. Client-Side compression and size limit checks (Malware-safe boundary)
    if (file.size > 10 * 1024 * 1024) {
      setErrorStatus('File payload exceeded security parameter (10MB maximum).');
      return;
    }

    setErrorStatus(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;

        // Call our Backend Secure API Endpoint
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Data,
            name: file.name,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Server rejected uploaded file.');
        }

        const data = await response.json();
        onUploadSuccess(data.id, base64Data, data.exifData);
      } catch (err: any) {
        console.error('File submit error:', err);
        setErrorStatus(err.message || 'An error occurred during secure image upload.');
      }
    };
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onBtnClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onBtnClick}
        className={`relative w-full h-[320px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/5 shadow-inner shadow-cyan-400/5 scale-[0.99]'
            : 'border-slate-800 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-950/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          id="uploader-file-input"
        />

        {/* HUD Deco angles */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-700 rounded-tl"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-700 rounded-tr"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-700 rounded-bl"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-700 rounded-br"></div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
            <h4 className="font-display font-bold text-sm tracking-widest text-cyan-400 font-mono uppercase mt-2">
              Processing Frames
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Running security isolation & cleaning metadata...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-center mb-5 hover:scale-110 shrink-0 transition-transform shadow-lg shadow-cyan-950/10">
              <UploadCloud className="w-7 h-7 text-cyan-400" />
            </div>

            <h3 className="font-display font-medium text-slate-100 text-sm mb-1 tracking-wide">
              DRAG & DROP IMAGE HERE
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              or click to browse local files
            </p>

            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5 leading-normal">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              JPEG, PNG, WEBP (MAXIMUM 10MB)
            </div>
          </div>
        )}
      </div>

      {errorStatus && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs flex items-start gap-2.5 font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{errorStatus}</span>
        </div>
      )}
    </div>
  );
}
