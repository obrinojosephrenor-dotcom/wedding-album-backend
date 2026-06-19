import { useState }    from "react";
import { motion }      from "framer-motion";
import { User, Clock } from "lucide-react";

export default function PhotoCard({ photo, onDelete, isAdmin }) {
  const [loaded,    setLoaded]    = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  const src = photo.thumbnail_url || photo.image_url;
  const dt  = new Date(photo.uploaded_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.9 }}
        whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(235,200,200,0.3)" }}
        className="floral-card !p-2 cursor-pointer overflow-hidden group relative"
        onClick={() => setExpanded(true)}
        aria-label={`Photo by ${photo.guest_name}`}
        tabIndex={0}
        role="button"
        onKeyDown={e => e.key === "Enter" && setExpanded(true)}
      >
        <div className="relative overflow-hidden rounded-xl aspect-square">
          <img
            src={src}
            alt={`Memory shared by ${photo.guest_name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
          {/* Floral overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-xs font-body flex items-center gap-1">
                <User size={10} /> {photo.guest_name}
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={e => { e.stopPropagation(); onDelete?.(photo.id); }}
              className="absolute top-2 right-2 bg-red-400/80 text-white rounded-full
                         w-6 h-6 flex items-center justify-center text-xs opacity-0
                         group-hover:opacity-100 transition-opacity"
              aria-label="Delete photo"
            >
              ×
            </button>
          )}
        </div>
        <div className="px-1 pt-1.5 pb-0.5 flex items-center justify-between gap-2">
          <span className="font-body text-xs text-taupe flex items-center gap-1 truncate">
            <User size={10} aria-hidden /> {photo.guest_name}
          </span>
          <span className="font-body text-xs text-silver flex items-center gap-1 shrink-0">
            <Clock size={10} aria-hidden /> {dt}
          </span>
        </div>
      </motion.article>

      {/* Lightbox */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            src={photo.medium_url || photo.image_url}
            alt={`Memory by ${photo.guest_name}`}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
            onClick={() => setExpanded(false)}
            aria-label="Close lightbox"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}