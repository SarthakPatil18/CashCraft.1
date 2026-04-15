import { motion } from "framer-motion";
import AvatarPanel from "@/components/AvatarPanel";
import BalanceOrb from "@/components/BalanceOrb";
import QuestBoard from "@/components/QuestBoard";
import FutureTimeline from "@/components/FutureTimeline";
import BossFight from "@/components/BossFight";
import FutureMessage from "@/components/FutureMessage";
import FutureScore from "@/components/FutureScore";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Top ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-3xl"
            >
              💰
            </motion.span>
            <h1 className="font-display text-3xl md:text-4xl font-black text-glow text-foreground tracking-wider">
              CASHCRAFT
            </h1>
            <motion.span
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-3xl"
            >
              ⚡
            </motion.span>
          </div>
          <p className="text-muted-foreground text-sm font-display tracking-widest">
            CRAFT YOUR FUTURE • ONE DECISION AT A TIME
          </p>
        </motion.header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <AvatarPanel />
            <FutureScore />
          </div>

          {/* Center column */}
          <div className="space-y-6">
            <BalanceOrb />
            <BossFight />
            <FutureMessage />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <QuestBoard />
            <FutureTimeline />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 pb-8"
        >
          <p className="text-xs text-muted-foreground font-display tracking-wider">
            "People don't fail at saving money because they lack tools… they fail because it's boring."
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
