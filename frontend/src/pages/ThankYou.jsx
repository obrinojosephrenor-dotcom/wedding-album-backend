import { Link }       from "react-router-dom";
import { motion }     from "framer-motion";
import FloralBorder   from "../components/FloralBorder";
import FloralCorner   from "../components/FloralCorner";
import FloralPetals   from "../components/FloralPetals";

export default function ThankYou() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <FloralPetals trigger={true} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="floral-card max-w-md w-full text-center relative"
      >
        <FloralCorner className="top-0 left-0 w-20 h-20 opacity-60" />
        <FloralCorner className="top-0 right-0 w-20 h-20 opacity-60" style={{ transform: "scaleX(-1)" }} />
        <FloralBorder />
        <div className="text-6xl mb-4">💐</div>
        <span className="script-accent text-4xl block mb-3">Thank You!</span>
        <h1 className="section-title text-2xl mb-4">Your Memories Mean Everything</h1>
        <p className="font-body text-taupe mb-8 leading-relaxed">
          Every photo you've shared will be treasured forever.
          Thank you for being part of our special day and for capturing these beautiful moments with us.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/gallery"  className="btn-primary">View the Gallery 🖼</Link>
          <Link to="/upload"   className="btn-secondary">Upload More Photos</Link>
        </div>
        <FloralBorder position="bottom" />
      </motion.div>
    </main>
  );
}