import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Petal({ x, delay, color }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50 text-2xl select-none"
      style={{ left: `${x}vw`, top: "-40px" }}
      initial={{ opacity: 1, y: 0, rotate: 0 }}
      animate={{
        opacity:   [1, 1, 0],
        y:         "100vh",
        rotate:    [0, 180, 360],
        x:         [0, 30, -20, 10],
      }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: "easeIn" }}
    >
      {color}
    </motion.div>
  );
}

export default function FloralPetals({ trigger = false }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const items = Array.from({ length: 18 }, (_, i) => ({
      id:    i,
      x:     Math.random() * 90,
      delay: Math.random() * 1.5,
      color: ["🌸","🌷","🌺","🌼","💐"][Math.floor(Math.random() * 5)],
    }));
    setPetals(items);
    const t = setTimeout(() => setPetals([]), 6000);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <AnimatePresence>
      {petals.map(p => <Petal key={p.id} {...p} />)}
    </AnimatePresence>
  );
}