import { AppLayout } from "@/components/layout/AppLayout";
import { useGetUserProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Shield, Target, Zap, Award, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Visual representation of the avatar stage
const AvatarDisplay = ({ stage, level }: { stage: string, level: number }) => {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-8">
      {/* Outer rotating ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-white/10 border-t-white/50 border-r-white/30"
      />
      
      {/* Inner pulsing glow */}
      <motion.div 
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full bg-white/5 blur-xl"
      />
      
      {/* Avatar Content */}
      <div className="absolute inset-8 rounded-full bg-black border border-white/20 flex flex-col items-center justify-center overflow-hidden glass-card shadow-[0_0_30px_rgba(255,255,255,0.1)] z-10">
        <Shield className="w-10 h-10 text-white mb-2" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">LVL {level}</span>
        <span className="text-sm font-black capitalize tracking-wider bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
          {stage}
        </span>
      </div>
    </div>
  );
};

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse max-w-2xl mx-auto space-y-8">
          <div className="h-64 rounded-3xl bg-white/5" />
          <div className="h-32 rounded-3xl bg-white/5" />
        </div>
      </AppLayout>
    );
  }

  const xpProgress = (profile?.xp || 0) / (profile?.xpToNextLevel || 1);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Identity</h1>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <Settings className="w-5 h-5 text-zinc-400" />
          </Button>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-8 text-center relative overflow-hidden"
        >
          <AvatarDisplay stage={profile?.avatarStage || 'novice'} level={profile?.level || 1} />
          
          <h2 className="text-3xl font-bold mb-1 tracking-tight">{profile?.name}</h2>
          <p className="text-zinc-400 mb-8">Joined {new Date(profile?.joinedAt || Date.now()).toLocaleDateString()}</p>
          
          <div className="max-w-sm mx-auto">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-zinc-400 uppercase tracking-widest font-bold">XP Progress</span>
              <span className="text-white font-medium">{profile?.xp} / {profile?.xpToNextLevel}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress * 100}%` }}
                className="h-full bg-white rounded-full shadow-[0_0_10px_#fff]"
              />
            </div>
            <p className="text-xs text-zinc-500">
              {profile ? profile.xpToNextLevel - profile.xp : 0} XP to reach Level {(profile?.level || 1) + 1}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <Zap className="w-6 h-6 text-white mb-4 opacity-50" />
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-white">{profile?.streak} <span className="text-lg text-zinc-500 font-normal">Days</span></p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <Award className="w-6 h-6 text-white mb-4 opacity-50" />
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Future Score</p>
            <p className="text-3xl font-bold text-white">{profile?.futureScore}</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-6 mb-8"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Financial Baseline</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-zinc-300">Monthly Income</span>
              <span className="font-bold">₹{profile?.monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-zinc-300">Savings Goal</span>
              <span className="font-bold">₹{profile?.savingsGoal.toLocaleString()}</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-6 bg-transparent border-white/10 hover:bg-white/5 text-white">
            Update Baseline
          </Button>
        </motion.div>
        
        <div className="flex justify-center">
          <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-white/5">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}