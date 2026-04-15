import { motion } from "framer-motion";
import avatarImg from "@/assets/avatar-current.png";

const stats = [
  { label: "Level", value: "12", icon: "⚡" },
  { label: "XP", value: "2,450", icon: "✨" },
  { label: "Streak", value: "7", icon: "🔥" },
];

const AvatarPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-6 flex flex-col items-center gap-5"
    >
      <div className="relative">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/20 bg-muted/30"
        >
          <img src={avatarImg} alt="Your Avatar" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-[10px] font-display font-bold text-primary-foreground shadow-lg">
          12
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-display text-sm font-bold text-foreground tracking-wide">Current You</h3>
        <p className="text-muted-foreground text-xs mt-0.5">Balanced Spender</p>
      </div>

      <div className="w-full h-px bg-border" />

      <div className="flex w-full justify-around">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="font-display text-sm font-bold text-foreground">{s.icon} {s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AvatarPanel;
