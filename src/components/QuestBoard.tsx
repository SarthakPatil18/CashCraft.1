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

const difficultyStyles: Record<string, string> = {
  easy: "text-neon-green bg-neon-green/8",
  medium: "text-accent bg-accent/8",
  hard: "text-neon-red bg-neon-red/8",
};

const QuestBoard = () => {
  const [quests, setQuests] = useState(initialQuests);

  const completeQuest = (id: number) => {
    setQuests(q => q.map(quest => quest.id === id ? { ...quest, completed: true } : quest));
  };

  const completed = quests.filter(q => q.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-sm font-bold text-foreground tracking-wide">DAILY QUESTS</h2>
        <span className="text-[10px] font-display text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {completed}/{quests.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(completed / quests.length) * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="space-y-2.5">
        {quests.map((quest, i) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
              quest.completed
                ? "bg-neon-green/5 opacity-50"
                : "bg-muted/20 hover:bg-muted/40"
            }`}
            onClick={() => !quest.completed && completeQuest(quest.id)}
          >
            <div className="w-9 h-9 rounded-lg bg-muted/30 flex items-center justify-center text-lg flex-shrink-0">
              {quest.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${quest.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {quest.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-display uppercase tracking-wider ${difficultyStyles[quest.difficulty]}`}>
                  {quest.difficulty}
                </span>
                <span className="text-[10px] text-muted-foreground">{quest.reward} • {quest.xp} XP</span>
              </div>
            </div>
            {quest.completed ? (
              <span className="text-neon-green text-sm">✓</span>
            ) : (
              <div className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground text-xs hover:border-primary/40 hover:text-primary transition-colors">
                →
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestBoard;
