import { useState } from "react";
import { uploadPhoto } from "../services/api";
import toast from "react-hot-toast";

const MAX_PHOTOS = 25;

export function useUpload(guest, onSuccess) {
  const [queue,     setQueue]     = useState([]);
  const [uploading, setUploading] = useState(false);

  function addFiles(files) {
    const slots = MAX_PHOTOS - (guest?.photo_count || 0);
    if (slots <= 0) return toast.error("You've reached your 25-photo limit 🌸");

    const accepted = Array.from(files).slice(0, slots);
    const entries  = accepted.map(f => ({
      file:     f,
      preview:  URL.createObjectURL(f),
      progress: 0,
      status:   "pending",
      id:       Math.random().toString(36).slice(2),
    }));
    setQueue(q => [...q, ...entries]);
    return entries;
  }

  async function processQueue(entries) {
    if (!guest?.id) return;
    setUploading(true);

    for (const entry of entries) {
      setQueue(q => q.map(e => e.id === entry.id ? { ...e, status: "uploading" } : e));

      try {
        const formData = new FormData();
        formData.append("photo",    entry.file);
        formData.append("guest_id", guest.id);

        const result = await uploadPhoto(formData, (pct) => {
          setQueue(q => q.map(e => e.id === entry.id ? { ...e, progress: pct } : e));
        });

        setQueue(q => q.map(e => e.id === entry.id ? { ...e, status: "done", progress: 100 } : e));
        onSuccess?.(result.photo, result.photos_remaining);
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || "Upload failed";
        const isLimit = err.response?.data?.error === "limit_reached";
        setQueue(q => q.map(e => e.id === entry.id ? { ...e, status: "error", errorMsg: msg } : e));
        if (isLimit) { toast.error(msg); break; }
        toast.error(`Failed to upload ${entry.file.name}`);
      }
    }
    setUploading(false);
  }

  async function uploadFiles(files) {
    const entries = addFiles(files);
    if (entries?.length) await processQueue(entries);
  }

  function clearDone() {
    setQueue(q => {
      q.filter(e => e.status === "done" || e.status === "error")
       .forEach(e => URL.revokeObjectURL(e.preview));
      return q.filter(e => e.status === "pending" || e.status === "uploading");
    });
  }

  return { queue, uploading, uploadFiles, clearDone };
}