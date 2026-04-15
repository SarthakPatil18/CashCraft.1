import { motion } from "framer-motion";
import { useState } from "react";

interface Quest {
  id: number;
  title: string;
  reward: string;
  xp: number;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
}

const initialQuests: Quest[] = [
  { id: 1, title: "Skip food delivery today", reward: "+500 coins", xp: 50, icon: "🍔", difficulty: "easy", completed: false },
  { id: 2, title: "Save ₹200 before noon", reward: "+800 coins", xp: 80, icon: "💎", difficulty: "medium", completed: false },
  { id: 3, title: "No online shopping this week", reward: "+2000 coins", xp: 200, icon: "🛡️", difficulty: "hard", completed: false },
  { id: 4, title: "Cook a meal at home", reward: "+300 coins", xp: 30, icon: "🍳", difficulty: "easy", completed: true },
];

const difficultyColors: Record<string, string> = {
  easy: "bg-neon-green/20 text-neon-green border-neon-green/30",
  medium: "bg-accent/20 text-accent border-accent/30",
  hard: "bg-neon-red/20 text-neon-red border-neon-red/30",
};

const QuestBoard = () => {
  const [quests, setQuests] = useState(initialQuests);

  const completeQuest = (id: number) => {
    setQuests(q => q.map(quest => quest.id === id ? { ...quest, completed: true } : quest));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="gradient-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground">🎯 Daily Quests</h2>
        <span className="text-xs font-display text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          {quests.filter(q => q.completed).length}/{quests.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {quests.map((quest, i) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
              quest.completed
                ? "bg-neon-green/5 border-neon-green/20 opacity-60"
                : "bg-muted/30 border-border hover:border-primary/40 hover:bg-muted/50"
            }`}
            onClick={() => !quest.completed && completeQuest(quest.id)}
          >
            <span className="text-2xl">{quest.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${quest.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {quest.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[quest.difficulty]}`}>
                  {quest.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">{quest.reward} • {quest.xp} XP</span>
              </div>
            </div>
            {quest.completed ? (
              <span className="text-neon-green text-lg">✓</span>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center text-primary text-sm hover:bg-primary/10"
              >
                →
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestBoard;
