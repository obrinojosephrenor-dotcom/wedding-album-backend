import { motion, AnimatePresence } from "framer-motion";
import FloralBorder from "./FloralBorder";
import FloralPetals from "./FloralPetals";

export default function SuccessModal({ show, count, remaining, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Upload success"
        >
          <FloralPetals trigger={show} />
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1,   y: 0  }}
            className="floral-card max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <FloralBorder />
            <div className="text-5xl mb-3">🌸</div>
            <span className="script-accent text-3xl block mb-2">Beautiful!</span>
            <p className="font-heading text-xl text-gray-700 mb-2">
              {count === 1 ? "Your photo" : `${count} photos`} added to our album
            </p>
            <p className="font-body text-sm text-taupe mb-6">
              {remaining > 0
                ? `You have ${remaining} more memories to share.`
                : "You've shared all 25 memories. Thank you! 💐"}
            </p>
            <button className="btn-primary w-full" onClick={onClose} autoFocus>
              {remaining > 0 ? "Upload More" : "View Gallery"}
            </button>
            <FloralBorder position="bottom" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}