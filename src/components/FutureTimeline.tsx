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

  const bars = [
    { label: "Zen You", value: data.zen, color: "bg-neon-green", dot: "bg-neon-green" },
    { label: "Current You", value: data.current, color: "gradient-primary", dot: "bg-primary" },
    { label: "Chaos You", value: data.chaos, color: "bg-neon-red", dot: "bg-neon-red" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <h2 className="font-display text-sm font-bold text-foreground tracking-wide mb-5">FUTURE SIMULATION</h2>

      <div className="flex gap-1.5 mb-6">
        {timelines.map((t, i) => (
          <button
            key={t.day}
            onClick={() => setSelectedDay(i)}
            className={`flex-1 py-2 rounded-lg font-display text-[10px] font-bold tracking-wider transition-all ${
              selectedDay === i
                ? "gradient-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            Day {t.day}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {bars.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                {item.label}
              </span>
              <span className="font-display font-bold text-foreground">₹{item.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
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
    </motion.div>
  );
};

export default FutureTimeline;
