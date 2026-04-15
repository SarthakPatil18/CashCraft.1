import { motion } from "framer-motion";
import { useState } from "react";

const timelines = [
  { day: 7, zen: 45200, current: 42850, chaos: 39500 },
  { day: 30, zen: 58000, current: 38200, chaos: 22000 },
  { day: 60, zen: 75000, current: 31000, chaos: 5000 },
  { day: 90, zen: 95000, current: 25000, chaos: 0 },
];

const FutureTimeline = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const data = timelines[selectedDay];

  const maxVal = Math.max(data.zen, data.current, data.chaos, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="gradient-card rounded-2xl border border-border p-6"
    >
      <h2 className="font-display text-lg font-bold text-foreground mb-4">🔮 Future Simulation</h2>

      {/* Timeline slider */}
      <div className="flex gap-2 mb-6">
        {timelines.map((t, i) => (
          <button
            key={t.day}
            onClick={() => setSelectedDay(i)}
            className={`flex-1 py-2 rounded-lg font-display text-xs font-bold transition-all ${
              selectedDay === i
                ? "gradient-primary text-primary-foreground glow-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Day {t.day}
          </button>
        ))}
      </div>

      {/* Bars */}
      <div className="space-y-4">
        {[
          { label: "🟢 Zen You", value: data.zen, color: "bg-neon-green", glowClass: "glow-neon-green" },
          { label: "⚖️ Current You", value: data.current, color: "gradient-primary", glowClass: "glow-primary" },
          { label: "🔴 Chaos You", value: data.chaos, color: "bg-neon-red", glowClass: "glow-neon-red" },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-display font-bold text-foreground">₹{item.value.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxVal) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center font-display">
        Slide through time to see your financial multiverse ✨
      </p>
    </motion.div>
  );
};

export default FutureTimeline;
