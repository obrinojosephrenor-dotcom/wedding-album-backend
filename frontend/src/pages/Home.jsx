import { useEffect, useRef, useState } from "react";
import { Link }         from "react-router-dom";
import { motion }       from "framer-motion";
import FloralBorder     from "../components/FloralBorder";
import FloralCorner     from "../components/FloralCorner";

const FADE_UP = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

function FloatingBloom({ x, y, size, delay, color }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-3xl"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: size }}
      animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 5 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {color}
    </motion.div>
  );
}

const blooms = [
  { x: 5,  y: 10, size: "2rem",   delay: 0,   color: "🌸" },
  { x: 90, y: 8,  size: "1.8rem", delay: 0.5, color: "🌷" },
  { x: 15, y: 75, size: "1.5rem", delay: 1,   color: "🌺" },
  { x: 80, y: 70, size: "2rem",   delay: 1.5, color: "🌼" },
  { x: 50, y: 5,  size: "1.2rem", delay: 0.8, color: "💐" },
  { x: 2,  y: 45, size: "1.4rem", delay: 2,   color: "🌸" },
  { x: 95, y: 45, size: "1.6rem", delay: 2.5, color: "🌷" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 py-16">
        {/* Floating blooms */}
        {blooms.map((b, i) => <FloatingBloom key={i} {...b} />)}

        {/* Corner decorations */}
        <FloralCorner className="top-4 left-4 w-28 h-28 opacity-60" />
        <FloralCorner className="top-4 right-4 w-28 h-28 opacity-60" style={{ transform: "scaleX(-1)" }} />
        <FloralCorner className="bottom-4 left-4 w-28 h-28 opacity-60" style={{ transform: "scaleY(-1)" }} />
        <FloralCorner className="bottom-4 right-4 w-28 h-28 opacity-60" style={{ transform: "scale(-1)" }} />

        <div className="text-center z-10 max-w-2xl mx-auto">
          <motion.span
            {...FADE_UP} transition={{ duration: 0.8, delay: 0.1 }}
            className="script-accent text-5xl md:text-6xl block mb-4"
          >
            Share Your Memories
          </motion.span>

          <FloralBorder />

          <motion.h1
            {...FADE_UP} transition={{ duration: 0.8, delay: 0.25 }}
            className="section-title mb-4"
          >
            With Us
          </motion.h1>

          <motion.p
            {...FADE_UP} transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-taupe text-lg md:text-xl mb-10 leading-relaxed"
          >
            Help us capture every beautiful moment of our special day.
            <br />
            <span className="text-sm opacity-70">Upload up to 25 photos — from your camera roll or live camera.</span>
          </motion.p>

          <motion.div
            {...FADE_UP} transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/upload"  className="btn-primary text-center">
              📷 Upload Photos
            </Link>
            <Link to="/gallery" className="btn-secondary text-center">
              🖼 View Gallery
            </Link>
          </motion.div>

          <FloralBorder position="bottom" />

          <motion.p
            {...FADE_UP} transition={{ duration: 0.8, delay: 0.7 }}
            className="font-body text-sm text-taupe/70 mt-8"
          >
            Scan the QR code at your table · No app needed · Works on any phone
          </motion.p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-4 text-center relative">
        <div className="max-w-xl mx-auto floral-card">
          <FloralBorder />
          <blockquote>
            <p className="font-heading text-2xl md:text-3xl italic text-gray-700 leading-relaxed mb-4">
              "In all the world, there is no heart for me like yours."
            </p>
            <footer className="font-script text-blush text-xl">— Maya Angelou</footer>
          </blockquote>
          <FloralBorder position="bottom" />
        </div>
      </section>
    </main>
  );
}