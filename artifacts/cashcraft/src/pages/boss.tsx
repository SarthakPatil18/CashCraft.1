import { AppLayout } from "@/components/layout/AppLayout";
import { useGetCurrentBoss, useFightBoss, useSurrenderToBoss } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Skull, Shield, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCurrentBossQueryKey } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useState } from "react";

export default function BossBattle() {
  const { data: boss, isLoading } = useGetCurrentBoss();
  const fightBoss = useFightBoss();
  const surrenderBoss = useSurrenderToBoss();
  const queryClient = useQueryClient();
  const [battleResult, setBattleResult] = useState<any>(null);

  const handleFight = () => {
    if (!boss) return;
    fightBoss.mutate({ bossId: boss.id }, {
      onSuccess: (result) => {
        setBattleResult(result);
        queryClient.invalidateQueries({ queryKey: getGetCurrentBossQueryKey() });
      }
    });
  };

  const handleSurrender = () => {
    if (!boss) return;
    surrenderBoss.mutate({ bossId: boss.id }, {
      onSuccess: (result) => {
        setBattleResult(result);
        queryClient.invalidateQueries({ queryKey: getGetCurrentBossQueryKey() });
      }
    });
  };

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-full"><div className="animate-pulse w-16 h-16 bg-white/10 rounded-full" /></div></AppLayout>;
  }

  // No active boss
  if (!boss?.active && !battleResult) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-zinc-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Area Clear</h2>
            <p className="text-zinc-400">No dangerous spending temptations detected. Your future score is safe for now.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <AnimatePresence mode="wait">
          {!battleResult ? (
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="max-w-2xl w-full text-center"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.02, 1],
                  textShadow: ["0 0 20px rgba(255,0,0,0)", "0 0 40px rgba(255,0,0,0.5)", "0 0 20px rgba(255,0,0,0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <Skull className="w-24 h-24 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]" />
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-2 uppercase">{boss?.name}</h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase">
                  <ShieldAlert className="w-3 h-3" />
                  {boss?.tier} THREAT
                </div>
              </motion.div>

              <p className="text-xl text-zinc-300 mb-12 max-w-lg mx-auto leading-relaxed">
                {boss?.description}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
                <div className="glass-card bg-black/80 border-red-500/20 p-4 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Cost</p>
                  <p className="text-2xl font-bold text-white">${boss?.amount}</p>
                </div>
                <div className="glass-card bg-black/80 border-red-500/20 p-4 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Score Risk</p>
                  <p className="text-2xl font-bold text-red-500">-{boss?.scoreRisk}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleFight}
                  disabled={fightBoss.isPending || surrenderBoss.isPending}
                  className="h-16 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all"
                >
                  <Sword className="w-5 h-5 mr-2" />
                  Fight (Save Money)
                </Button>
                <Button 
                  onClick={handleSurrender}
                  disabled={fightBoss.isPending || surrenderBoss.isPending}
                  variant="outline"
                  className="h-16 px-8 rounded-full border-red-500/30 text-red-400 hover:bg-red-950/30 hover:text-red-300 text-lg font-bold"
                >
                  Give In (Spend)
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full glass-card rounded-3xl p-8 text-center border-t border-white/20"
            >
              {battleResult.victory ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,255,255,0.5)]">
                    <Sword className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2">Victory!</h2>
                  <p className="text-zinc-400 mb-8">{battleResult.message}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                      <span className="text-zinc-400">Score Earned</span>
                      <span className="text-xl font-bold text-white">+{battleResult.scoreChange}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                      <span className="text-zinc-400">XP Gained</span>
                      <span className="text-xl font-bold text-white">+{battleResult.xpChange}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                   <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-6 border border-red-500/50">
                    <Skull className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2 text-red-500">Defeated</h2>
                  <p className="text-zinc-400 mb-8">{battleResult.message}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-red-950/30 border border-red-900/30">
                      <span className="text-zinc-400">Score Lost</span>
                      <span className="text-xl font-bold text-red-500">{battleResult.scoreChange}</span>
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                onClick={() => setBattleResult(null)}
                className="w-full h-14 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold"
              >
                Return to Command Center
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}