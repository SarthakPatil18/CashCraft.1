import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const BossFight = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<"won" | "lost" | null>(null);

  const triggerFight = () => {
    setIsOpen(true);
    setResult(null);
  };

  const fight = () => {
    setResult("won");
    setTimeout(() => setIsOpen(false), 2000);
  };

  const surrender = () => {
    setResult("lost");
    setTimeout(() => setIsOpen(false), 2000);
  };

  return (
    <>
      <motion.button
        onClick={triggerFight}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full glass-card rounded-2xl p-5 text-left hover:border-neon-red/30 transition-all group"
        style={{ borderColor: 'hsl(var(--neon-red) / 0.15)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-neon-red/10 flex items-center justify-center text-xl">
            ⚔️
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xs font-bold text-neon-red tracking-wide">IMPULSE BOSS DETECTED</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Midnight food order — Tap to battle</p>
          </div>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted-foreground text-sm"
          >
            →
          </motion.span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card-elevated rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
              style={{ borderColor: 'hsl(var(--neon-red) / 0.2)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-neon-red/5 blur-[80px]" />

              {result === null ? (
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-neon-red/10 flex items-center justify-center text-4xl mx-auto mb-5">
                    👹
                  </div>
                  <h2 className="font-display text-lg font-black text-neon-red tracking-wide mb-2">IMPULSE BOSS</h2>
                  <p className="text-sm text-foreground/80 mb-1">Late Night Food Order — ₹450</p>
                  <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                    "If you order this, Future You loses ₹12,000 in savings by next month."
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={fight}
                      className="flex-1 py-3 rounded-xl font-display font-bold text-xs tracking-wide bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/15 transition-all"
                    >
                      ❌ Fight It
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={surrender}
                      className="flex-1 py-3 rounded-xl font-display font-bold text-xs tracking-wide bg-neon-red/10 text-neon-red border border-neon-red/20 hover:bg-neon-red/15 transition-all"
                    >
                      ⚔️ Accept Damage
                    </motion.button>
                  </div>
                </div>
              ) : result === "won" ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative z-10 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-neon-green/10 flex items-center justify-center text-4xl mx-auto mb-4">
                    🏆
                  </div>
                  <h2 className="font-display text-lg font-black text-neon-green tracking-wide mb-2">BOSS DEFEATED</h2>
                  <p className="text-sm text-neon-green/80">+500 XP • +₹450 Saved</p>
                  <p className="text-xs text-muted-foreground mt-2">Future You is proud 💪</p>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative z-10 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-neon-red/10 flex items-center justify-center text-4xl mx-auto mb-4">
                    💀
                  </div>
                  <h2 className="font-display text-lg font-black text-neon-red tracking-wide mb-2">DAMAGE TAKEN</h2>
                  <p className="text-sm text-neon-red/80">-₹450 • Future savings impacted</p>
                  <p className="text-xs text-muted-foreground mt-2">Next time, fight harder 🔥</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BossFight;
