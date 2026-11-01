"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  fetchPhotos,
  uploadPhotos,
  type Photo,
  type PhotoEntityType,
} from "@/lib/photos";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  UploadCloud,
} from "lucide-react";

interface PhotosDialogProps {
  user_id: string;
  entity_type: PhotoEntityType;
  entity_id: string;
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  onPhotosUploaded?: () => void;
}

export function PhotosDialog({
  user_id,
  entity_type,
  entity_id,
  title,
  description,
  open,
  onClose,
  onPhotosUploaded,
}: PhotosDialogProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [index, setIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    setLoading(true);
    setIndex(0);

    fetchPhotos({
      user_id,
      entity_type,
      entity_id,
    })
      .then((result) => {
        if (!cancelled) {
          setPhotos(result);
          setIndex(0);
        }
      })
      .catch((err) => {
        console.error("Failed to load photos:", err);

        if (!cancelled) {
          setPhotos([]);
          toast.error("Failed to load photos.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, user_id, entity_type, entity_id]);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;

    if (!files?.length) return;

    setUploading(true);

    try {
      const { uploaded, failed, errors } = await uploadPhotos(
        supabase,
        Array.from(files),
        {
          user_id,
          entity_type,
          entity_id,
        },
      );

      errors.forEach((error) =>
        console.error("Photo upload error:", error),
      );

      if (uploaded > 0) {
        const updatedPhotos = await fetchPhotos({
          user_id,
          entity_type,
          entity_id,
        });

        setPhotos(updatedPhotos);
        setIndex(0);
        onPhotosUploaded?.();

        toast.success(
          `${uploaded} photo${uploaded === 1 ? "" : "s"} uploaded successfully.`,
        );
      }

      if (failed > 0) {
        toast.error(
          `${failed} photo${failed === 1 ? "" : "s"} failed to upload.`,
        );
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error("Failed to upload photos.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const current = photos[index] ?? null;
  const hasMultiple = photos.length > 1;

  const goPrev = () =>
    setIndex((i) => (i <= 0 ? photos.length - 1 : i - 1));

  const goNext = () =>
    setIndex((i) => (i >= photos.length - 1 ? 0 : i + 1));

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent className="max-w-[90vw] sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {title}
          </DialogTitle>

          <DialogDescription className="text-center">
            {description ? `${description} — ` : ""}
            {photos.length} photo{photos.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                <span>Upload Photos</span>
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[360px]">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex items-center justify-center min-h-[360px] text-muted-foreground">
            No photos yet. Upload some to get started.
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {hasMultiple && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goPrev}
                aria-label="Previous photo"
                className="shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            <div className="flex-1 flex justify-center items-center min-h-[360px] bg-muted/30 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.public_url}
                alt={`Photo ${index + 1} of ${photos.length}`}
                className="max-h-[70vh] max-w-full w-auto object-contain"
              />
            </div>

            {hasMultiple && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goNext}
                aria-label="Next photo"
                className="shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        {hasMultiple && !loading && (
          <p className="text-center text-sm text-muted-foreground">
            {index + 1} / {photos.length}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}