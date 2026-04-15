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
      className="gradient-card rounded-2xl border border-primary/20 p-5 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-primary blur-[80px]" />
      </div>

      <div className="flex items-start gap-3 z-10 relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg flex-shrink-0"
        >
          👻
        </motion.div>
        <div>
          <p className="text-xs font-display text-primary mb-1 tracking-wider">MESSAGE FROM FUTURE YOU</p>
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-foreground/90 leading-relaxed"
          >
            "{messages[msgIndex]}"
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default FutureMessage;
