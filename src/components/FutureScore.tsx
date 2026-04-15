import { motion } from "framer-motion";

const leaderboard = [
  { name: "You", score: 820, rank: 3 },
  { name: "Priya S.", score: 950, rank: 1 },
  { name: "Rahul K.", score: 890, rank: 2 },
  { name: "Ankit M.", score: 780, rank: 4 },
  { name: "Sneha R.", score: 720, rank: 5 },
];

const sorted = [...leaderboard].sort((a, b) => a.rank - b.rank);

const FutureScore = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="gradient-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground">🏆 Leaderboard</h2>
        <div className="text-right">
          <p className="font-display text-2xl font-black text-glow-gold text-accent">820</p>
          <p className="text-xs text-muted-foreground">Your Score</p>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((player, i) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              player.name === "You"
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/20"
            }`}
          >
            <span className="font-display text-sm font-bold w-6 text-center text-muted-foreground">
              {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : player.rank === 3 ? "🥉" : `#${player.rank}`}
            </span>
            <span className={`text-sm flex-1 ${player.name === "You" ? "font-bold text-primary" : "text-foreground"}`}>
              {player.name}
            </span>
            <span className="font-display text-sm font-bold text-accent">{player.score}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FutureScore;
