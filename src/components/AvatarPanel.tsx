import { motion } from "framer-motion";
import avatarImg from "@/assets/avatar-current.png";

const stats = [
  { label: "Level", value: "12", icon: "⚡" },
  { label: "XP", value: "2,450", icon: "✨" },
  { label: "Streak", value: "7 🔥", icon: "" },
];

const AvatarPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="gradient-card rounded-2xl border border-border p-6 flex flex-col items-center gap-4 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary blur-[80px]" />
      </div>

      <div className="relative">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-28 rounded-full glow-primary flex items-center justify-center overflow-hidden border-2 border-primary/40"
        >
          <img src={avatarImg} alt="Your Avatar" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-xs font-display font-bold text-accent-foreground"
        >
          12
        </motion.div>
      </div>

      <div className="text-center z-10">
        <h3 className="font-display text-lg font-bold text-foreground">Current You</h3>
        <p className="text-muted-foreground text-sm">⚖️ Balanced Spender</p>
      </div>

      <div className="flex gap-4 z-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-sm font-bold text-accent">{s.icon}{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AvatarPanel;
