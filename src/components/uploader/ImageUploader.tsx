import React, { useRef, useState } from "react";

type UploadedMedia = {
  _id: string;
  link: string;
  [key: string]: any;
};

interface ImageUploaderProps {
  token: string | undefined;
  onUploaded: (file: UploadedMedia) => void;
  maxSizeMb?: number;
  accept?: string;
}

const API_DOMAIN = "https://api-new.mrmeds.in";
const UPLOAD_URL = `${API_DOMAIN}/admin/file/media`;

export default function ImageUploader({ token, onUploaded, maxSizeMb = 5, accept = "image/*" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `Image must be smaller than ${maxSizeMb}MB`;
    }
    return null;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!token) {
      setError("Missing token for upload");
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      const uploaded: UploadedMedia | undefined = json?.data?.[0];
      if (!uploaded || !uploaded.link) {
        throw new Error("Unexpected response from server");
      }
      onUploaded(uploaded);
    } catch (e: any) {
      setError(e?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 rounded-xl relative group h-[200px] cursor-pointer overflow-hidden flex items-center justify-center">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center text-gray-600"
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <img src="/rte-editor/upload_prescription.svg" alt="uploading" width={90} height={90} className="animate-bounce" />
            <span className="mt-2">Uploading...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="mt-2">Click to upload</span>
          </>
        )}
      </button>
      {error && (
        <div className="absolute bottom-2 left-2 right-2 text-xs text-red-600 bg-white/80 px-2 py-1 rounded-md border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}


