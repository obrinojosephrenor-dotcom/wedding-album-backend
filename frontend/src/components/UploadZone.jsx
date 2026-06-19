import { useCallback }   from "react";
import { useDropzone }   from "react-dropzone";
import { motion }        from "framer-motion";
import { Upload, Camera } from "lucide-react";

export default function UploadZone({ onFiles, disabled, photosLeft }) {
  const onDrop = useCallback(files => {
    if (!disabled && files.length) onFiles(files);
  }, [onFiles, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: true,
    maxSize:  15 * 1024 * 1024,
    disabled,
  });

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <motion.div
        {...getRootProps()}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled  ? { scale: 0.99 } : {}}
        className={`
          border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
          transition-all duration-300 select-none
          ${isDragActive ? "border-sage bg-sage/10"    : "border-blush/50 bg-blush/5"}
          ${disabled     ? "opacity-50 cursor-not-allowed" : "hover:border-sage hover:bg-sage/5"}
        `}
        aria-label="Drop zone for photo upload"
        role="button"
        tabIndex={0}
      >
        <input {...getInputProps()} aria-label="File input" />
        <Upload size={40} className="mx-auto mb-3 text-blush/70" aria-hidden />
        <p className="font-heading text-xl text-gray-700 mb-1">
          {isDragActive ? "Drop your photos here" : "Drag photos here"}
        </p>
        <p className="font-body text-sm text-taupe">
          or click to browse · up to 15 MB each
        </p>
        {photosLeft > 0 && (
          <p className="mt-3 font-body text-xs text-sage font-medium">
            {photosLeft} photo{photosLeft !== 1 ? "s" : ""} remaining
          </p>
        )}
      </motion.div>

      {/* Camera button for mobile */}
      <label
        className={`
          flex items-center justify-center gap-2
          btn-secondary w-full cursor-pointer
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
        aria-label="Take a photo with camera"
      >
        <Camera size={18} aria-hidden />
        Take a Photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={e => e.target.files?.length && onFiles(e.target.files)}
          disabled={disabled}
          aria-hidden="true"
        />
      </label>
    </div>
  );
}