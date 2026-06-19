import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";

function QueueItem({ entry }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0  }}
      exit={{    opacity: 0, x:  20 }}
      className="flex items-center gap-3 bg-white/80 rounded-xl p-3 border border-blush/20"
    >
      <img
        src={entry.preview}
        alt=""
        className="w-12 h-12 object-cover rounded-lg"
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs text-gray-600 truncate">{entry.file.name}</p>
        {entry.status === "uploading" && (
          <div className="mt-1">
            <div className="w-full bg-silver/40 rounded-full h-1.5">
              <motion.div
                className="bg-sage h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${entry.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-taupe mt-0.5">{entry.progress}%</p>
          </div>
        )}
        {entry.status === "error" && (
          <p className="text-xs text-red-400 mt-0.5 truncate">{entry.errorMsg}</p>
        )}
      </div>
      <span aria-label={`Status: ${entry.status}`}>
        {entry.status === "done"      && <CheckCircle size={18} className="text-sage" />}
        {entry.status === "error"     && <XCircle     size={18} className="text-red-400" />}
        {entry.status === "uploading" && <Loader      size={18} className="text-blush animate-spin" />}
      </span>
    </motion.div>
  );
}

export default function UploadProgressBar({ queue }) {
  if (!queue.length) return null;

  return (
    <section aria-label="Upload queue" className="space-y-2">
      <h3 className="font-heading text-lg text-gray-700">Uploading</h3>
      <AnimatePresence>
        {queue.map(e => <QueueItem key={e.id} entry={e} />)}
      </AnimatePresence>
    </section>
  );
}