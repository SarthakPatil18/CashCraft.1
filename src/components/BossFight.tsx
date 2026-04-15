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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full gradient-card rounded-2xl border border-neon-red/30 p-5 text-left hover:border-neon-red/50 transition-all group"
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            ⚔️
          </motion.span>
          <div>
            <h3 className="font-display text-sm font-bold text-neon-red">Impulse Boss Detected!</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Midnight food order incoming — Tap to battle</p>
          </div>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-auto text-neon-red"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="gradient-card border border-neon-red/40 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* Danger glow */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-neon-red blur-[100px]" />
              </div>

              {result === null ? (
                <div className="relative z-10">
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    👹
                  </motion.p>
                  <h2 className="font-display text-xl font-black text-neon-red mb-2">IMPULSE BOSS</h2>
                  <p className="text-sm text-muted-foreground mb-1">Late Night Food Order — ₹450</p>
                  <p className="text-xs text-neon-red/80 mb-6 font-display">
                    "If you order this, Future You loses ₹12,000 in savings by next month."
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fight}
                      className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30 transition-all"
                    >
                      ❌ Fight It!
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={surrender}
                      className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-neon-red/20 text-neon-red border border-neon-red/30 hover:bg-neon-red/30 transition-all"
                    >
                      ⚔️ Accept Damage
                    </motion.button>
                  </div>
                </div>
              ) : result === "won" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10"
                >
                  <p className="text-5xl mb-3">🏆</p>
                  <h2 className="font-display text-xl font-black text-neon-green text-glow mb-2">BOSS DEFEATED!</h2>
                  <p className="text-sm text-neon-green">+500 XP • +₹450 Saved</p>
                  <p className="text-xs text-muted-foreground mt-2">Future You is proud 💪</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10"
                >
                  <p className="text-5xl mb-3">💀</p>
                  <h2 className="font-display text-xl font-black text-neon-red mb-2">DAMAGE TAKEN</h2>
                  <p className="text-sm text-neon-red">-₹450 • Future savings impacted</p>
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
