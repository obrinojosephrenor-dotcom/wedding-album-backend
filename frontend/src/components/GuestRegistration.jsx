import { useState }  from "react";
import { motion }    from "framer-motion";
import FloralBorder  from "./FloralBorder";

export default function GuestRegistration({ onRegister, loading, error }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim().length >= 2) onRegister(name.trim());
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="floral-card max-w-md mx-auto text-center"
    >
      <FloralBorder />
      <span className="script-accent text-3xl block mb-2">Welcome!</span>
      <h2 className="section-title text-2xl mb-2">Share Your Name</h2>
      <p className="font-body text-taupe text-sm mb-6">
        So we know who captured each beautiful moment 💐
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          className="input-field mb-4"
          placeholder="Your full name"
          value={name}
          onChange={e => setName(e.target.value)}
          minLength={2}
          required
          autoFocus
          aria-label="Your name"
        />
        {error && (
          <p className="text-red-400 text-sm mb-3 font-body" role="alert">{error}</p>
        )}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading || name.trim().length < 2}
          aria-busy={loading}
        >
          {loading ? "Just a moment…" : "Continue →"}
        </button>
      </form>
      <FloralBorder position="bottom" />
    </motion.div>
  );
}