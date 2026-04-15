import { motion } from "framer-motion";

const BalanceOrb = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="glass-card-elevated rounded-2xl p-8 flex flex-col items-center gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-primary/6 blur-[100px]" />

      <p className="text-xs text-muted-foreground font-display tracking-[0.2em] uppercase z-10">Total Balance</p>

      <motion.div
        className="relative z-10"
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight">
          ₹42,850
        </h1>
      </motion.div>

      <div className="flex gap-8 z-10 mt-2">
        <div className="text-center">
          <p className="text-neon-green text-sm font-semibold">+₹15,000</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Income</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-neon-red text-sm font-semibold">-₹8,200</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Spent</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-accent text-sm font-semibold">₹6,800</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Saved</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceOrb;
