import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const messages = [
  "Hey… I'm you from 30 days later. Please don't order that again tonight. 🙏",
  "If you save ₹200 today, I get to breathe easier. Trust me.",
  "That streak you're building? It changes everything. Keep going. 🔥",
  "I wish you'd paused before that last spend. But today is a new day.",
  "You're one good decision away from a completely different future. ✨",
];

const FutureMessage = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden"
      style={{ borderColor: 'hsl(var(--primary) / 0.15)' }}
    >
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-primary/4 blur-[60px]" />

      <div className="flex items-start gap-3 z-10 relative">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-sm flex-shrink-0">
          👻
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-display text-primary/70 mb-1.5 tracking-[0.2em] uppercase">Future You</p>
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-foreground/80 leading-relaxed"
          >
            "{messages[msgIndex]}"
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default FutureMessage;
