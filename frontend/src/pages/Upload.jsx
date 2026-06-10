import { useState }         from "react";
import { useNavigate }      from "react-router-dom";
import { motion }           from "framer-motion";
import { useGuest }         from "../hooks/useGuest";
import { useUpload }        from "../hooks/useUpload";
import GuestRegistration    from "../components/GuestRegistration";
import UploadZone           from "../components/UploadZone";
import UploadProgressBar    from "../components/UploadProgressBar";
import SuccessModal         from "../components/SuccessModal";
import FloralBorder         from "../components/FloralBorder";
import FloralCorner         from "../components/FloralCorner";

const MAX_PHOTOS = 25;

export default function Upload() {
  const navigate          = useNavigate();
  const { guest, loading, error, register, updatePhotoCount } = useGuest();
  const [success,         setSuccess]         = useState(null); // { count, remaining }
  const [successVisible,  setSuccessVisible]  = useState(false);

  const { queue, uploading, uploadFiles } = useUpload(guest, (photo, remaining) => {
    updatePhotoCount(1);
    if (remaining === 0) {
      setSuccess({ count: 1, remaining: 0 });
      setSuccessVisible(true);
    }
  });

  async function handleFiles(files) {
    await uploadFiles(files);
    const done = queue.filter(e => e.status === "done").length + files.length;
    if (done > 0) {
      setSuccess({ count: done, remaining: Math.max(0, (guest?.photo_count || 0) + done) });
      setSuccessVisible(true);
    }
  }

  const photosLeft = MAX_PHOTOS - (guest?.photo_count || 0);
  const limitReached = guest && photosLeft <= 0;

  function handleSuccessClose() {
    setSuccessVisible(false);
    if (success?.remaining === 0) navigate("/gallery");
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative"
        >
          <FloralCorner className="top-0 left-0 w-20 h-20 opacity-50" />
          <FloralCorner className="top-0 right-0 w-20 h-20 opacity-50" style={{ transform: "scaleX(-1)" }} />
          <span className="script-accent text-4xl block mb-2">Share a Moment</span>
          <h1 className="section-title text-3xl">Upload Your Photos</h1>
          <p className="font-body text-taupe mt-2 text-sm">Up to 25 photos per guest</p>
        </motion.div>

        {/* Guest registration gate */}
        {!guest ? (
          <GuestRegistration onRegister={register} loading={loading} error={error} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Guest greeting */}
            <div className="floral-card text-center py-4">
              <FloralBorder />
              <p className="font-heading text-xl text-gray-700">
                Hello, <span className="text-blush">{guest.guest_name}</span>! 🌸
              </p>
              <p className="font-body text-sm text-taupe mt-1">
                {limitReached
                  ? "You've shared all 25 memories. Thank you!"
                  : `${photosLeft} of 25 photos remaining`}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-silver/30 rounded-full h-2 mt-3">
                <motion.div
                  className="bg-blush h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(guest.photo_count / MAX_PHOTOS) * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <FloralBorder position="bottom" />
            </div>

            {/* Limit reached message */}
            {limitReached ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="floral-card text-center py-8"
              >
                <FloralBorder />
                <div className="text-5xl mb-4">💐</div>
                <p className="font-heading text-xl text-gray-700 mb-2">
                  You've reached your 25-photo memory limit.
                </p>
                <p className="font-body text-taupe text-sm">
                  Thank you for celebrating with us!
                </p>
                <FloralBorder position="bottom" />
              </motion.div>
            ) : (
              <>
                <UploadZone
                  onFiles={handleFiles}
                  disabled={uploading || limitReached}
                  photosLeft={photosLeft}
                />
                <UploadProgressBar queue={queue} />
              </>
            )}
          </motion.div>
        )}
      </div>

      <SuccessModal
        show={successVisible}
        count={success?.count}
        remaining={photosLeft}
        onClose={handleSuccessClose}
      />
    </main>
  );
}