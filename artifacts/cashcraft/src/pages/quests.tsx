import { AppLayout } from "@/components/layout/AppLayout";
import { useListQuests, useCompleteQuest } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Circle, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getListQuestsQueryKey } from "@workspace/api-client-react";
import { toast } from "sonner";

export default function Quests() {
  const { data: quests, isLoading } = useListQuests();
  const completeQuest = useCompleteQuest();
  const queryClient = useQueryClient();

  const handleComplete = (id: string) => {
    completeQuest.mutate({ questId: id }, {
      onSuccess: (data) => {
        toast.success(`Quest Completed! +${data.xpEarned} XP`, {
          description: data.leveledUp ? `LEVEL UP! You are now level ${data.newLevel}` : undefined
        });
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
      }
    });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-zinc-400 border-zinc-700 bg-zinc-800/50';
      case 'medium': return 'text-blue-400 border-blue-900 bg-blue-950/30';
      case 'hard': return 'text-red-400 border-red-900 bg-red-950/30';
      default: return 'text-zinc-400 border-zinc-700 bg-zinc-800/50';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Money Quests</h1>
            <p className="text-zinc-400">Daily missions to build discipline and stack XP.</p>
          </div>
          <div className="hidden md:flex glass-card px-4 py-2 rounded-full items-center gap-2 border-white/20">
            <Flame className="w-4 h-4 text-white" />
            <span className="font-bold text-sm">Resets in 14:22:05</span>
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {quests?.map((quest, i) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
                  quest.completed ? "opacity-60 grayscale-[0.5]" : "hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                        getDifficultyColor(quest.difficulty)
                      )}>
                        {quest.difficulty}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {quest.category}
                      </span>
                    </div>
                    <h3 className={cn("text-xl font-bold tracking-tight mb-1", quest.completed && "line-through text-zinc-400")}>
                      {quest.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{quest.description}</p>
                    
                    {!quest.completed && quest.target > 1 && (
                      <div className="mt-4 max-w-sm">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-500">Progress</span>
                          <span className="text-zinc-300 font-medium">{quest.progress} / {quest.target}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                            className="h-full bg-white rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col items-center justify-between gap-4 md:w-32 shrink-0">
                    <div className="text-center">
                      <span className="text-2xl font-bold tracking-tighter text-white">+{quest.xpReward}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">XP</span>
                    </div>
                    
                    <Button 
                      disabled={quest.completed || completeQuest.isPending || (quest.target > 1 && quest.progress < quest.target)}
                      onClick={() => handleComplete(quest.id)}
                      className={cn(
                        "w-full rounded-xl font-bold transition-all",
                        quest.completed 
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                          : "bg-white text-black hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      )}
                    >
                      {quest.completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Done
                        </>
                      ) : (
                        'Claim XP'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}