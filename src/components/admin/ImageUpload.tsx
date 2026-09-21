"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  accept?: string;
}

function ImageUpload({
  value,
  onChange,
  className,
  accept = "image/*",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          onChange(url);
          setPreview(url);
          URL.revokeObjectURL(objectUrl);
        } else {
          setPreview(value || null);
        }
      } catch {
        setPreview(value || null);
      } finally {
        setUploading(false);
      }
    },
    [onChange, value]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative group rounded-lg border border-brand-border-light overflow-hidden">
          <img
            src={preview}
            alt="معاينة"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-brand-text hover:bg-brand-secondary-light transition-colors cursor-pointer"
            >
              تغيير
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-white rounded-lg text-brand-error hover:bg-red-50 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
            isDragging
              ? "border-brand-accent bg-brand-accent/5"
              : "border-brand-border hover:border-brand-accent/50 hover:bg-brand-surface-hover"
          )}
        >
          {uploading ? (
            <div className="w-8 h-8 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center text-brand-text-muted">
                <ImageIcon size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-brand-text-secondary">
                  اضغط أو اسحب الصورة هنا
                </p>
                <p className="text-xs text-brand-text-muted mt-1">
                  PNG, JPG, WebP بحد أقصى 5MB
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-brand-accent font-medium">
                <Upload size={14} />
                <span>رفع صورة</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export { ImageUpload };
