import { motion } from "framer-motion";

const leaderboard = [
  { name: "Priya S.", score: 950, rank: 1 },
  { name: "Rahul K.", score: 890, rank: 2 },
  { name: "You", score: 820, rank: 3 },
  { name: "Ankit M.", score: 780, rank: 4 },
  { name: "Sneha R.", score: 720, rank: 5 },
];

const FutureScore = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-sm font-bold text-foreground tracking-wide">LEADERBOARD</h2>
        <div className="text-right">
          <p className="font-display text-xl font-black text-accent">820</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Your Score</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {leaderboard.map((player, i) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
              player.name === "You"
                ? "bg-primary/8 border border-primary/15"
                : ""
            }`}
          >
            <span className="font-display text-xs w-5 text-center text-muted-foreground">
              {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : player.rank === 3 ? "🥉" : `${player.rank}`}
            </span>
            <span className={`flex-1 text-sm ${player.name === "You" ? "font-semibold text-primary" : "text-foreground/70"}`}>
              {player.name}
            </span>
            <span className="font-display text-xs font-bold text-muted-foreground">{player.score}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FutureScore;
