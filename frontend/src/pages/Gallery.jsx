import { useEffect, useRef }  from "react";
import { motion }             from "framer-motion";
import Masonry                from "react-masonry-css";
import { usePhotos }          from "../hooks/usePhotos";
import PhotoCard              from "../components/PhotoCard";
import FloralBorder           from "../components/FloralBorder";
import FloralCorner           from "../components/FloralCorner";
import { Loader }             from "lucide-react";

const MASONRY_BREAKPOINTS = {
  default: 4,
  1280: 4,
  1024: 3,
  768:  2,
  480:  2,
  0:    1,
};

export default function Gallery() {
  const { photos, total, loading, hasMore, loadMore } = usePhotos();
  const sentinelRef = useRef(null);

  // Infinite scroll
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) loadMore();
    }, { threshold: 0.1 });

    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative"
        >
          <FloralCorner className="top-0 left-0 w-20 h-20 opacity-50" />
          <FloralCorner className="top-0 right-0 w-20 h-20 opacity-50" style={{ transform: "scaleX(-1)" }} />
          <span className="script-accent text-4xl block mb-2">Our Memories</span>
          <h1 className="section-title text-3xl mb-3">Live Wedding Gallery</h1>
          <FloralBorder />
          {total > 0 && (
            <p className="font-body text-taupe text-sm mt-2">
              {total} {total === 1 ? "memory" : "memories"} shared · updates in real time
            </p>
          )}
        </motion.div>

        {/* Empty state */}
        {!loading && photos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="floral-card text-center py-16 max-w-md mx-auto"
          >
            <FloralBorder />
            <div className="text-5xl mb-4">🌸</div>
            <p className="font-heading text-xl text-gray-600 mb-2">No memories yet</p>
            <p className="font-body text-sm text-taupe">
              Be the first to share a moment!
            </p>
            <FloralBorder position="bottom" />
          </motion.div>
        )}

        {/* Masonry Grid */}
        {photos.length > 0 && (
          <Masonry
            breakpointCols={MASONRY_BREAKPOINTS}
            className="flex gap-4 -ml-4"
            columnClassName="pl-4 space-y-4"
          >
            {photos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </Masonry>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center py-10" aria-live="polite" aria-label="Loading photos">
            <Loader size={30} className="text-blush animate-spin" />
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4" aria-hidden />

        {/* End of gallery */}
        {!hasMore && photos.length > 0 && (
          <div className="text-center pt-8">
            <FloralBorder />
            <p className="font-script text-2xl text-blush">
              Every moment, captured with love ✨
            </p>
          </div>
        )}
      </div>
    </main>
  );
}