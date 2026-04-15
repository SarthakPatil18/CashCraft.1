import { motion } from "framer-motion";

const BalanceOrb = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="gradient-card rounded-2xl border border-border p-6 flex flex-col items-center gap-3 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full bg-neon-blue blur-[100px]" />
      </div>

      <p className="text-sm text-muted-foreground font-display tracking-widest uppercase z-10">Total Balance</p>

      <motion.div
        className="relative z-10"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <h1 className="font-display text-4xl md:text-5xl font-black text-glow text-foreground">
          ₹42,850
        </h1>
      </motion.div>

      <div className="flex gap-6 z-10 mt-2">
        <div className="text-center">
          <p className="text-neon-green text-sm font-semibold">+₹15,000</p>
          <p className="text-xs text-muted-foreground">Income</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-neon-red text-sm font-semibold">-₹8,200</p>
          <p className="text-xs text-muted-foreground">Spent</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-accent text-sm font-semibold">₹6,800</p>
          <p className="text-xs text-muted-foreground">Saved</p>
        </div>
      </div>

      {/* Floating coins decoration */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-accent/30 text-lg"
          style={{
            left: `${15 + i * 18}%`,
            top: `${10 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        >
          💰
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BalanceOrb;
