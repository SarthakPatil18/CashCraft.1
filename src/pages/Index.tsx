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
      {/* Subtle grid */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary) / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.2) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* Ambient glows */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/4 blur-[200px] rounded-full" />
      <div className="fixed bottom-[-200px] right-[-100px] w-[500px] h-[400px] bg-neon-blue/3 blur-[180px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-4 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <h1 className="font-display text-2xl md:text-3xl font-black tracking-[0.2em] text-foreground">
              CASHCRAFT
            </h1>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <p className="text-muted-foreground text-xs font-display tracking-[0.3em] uppercase">
            Craft your future • One decision at a time
          </p>
        </motion.header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-5">
            <AvatarPanel />
            <FutureScore />
          </div>

          {/* Center column */}
          <div className="lg:col-span-5 space-y-5">
            <BalanceOrb />
            <BossFight />
            <FutureMessage />
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-5">
            <QuestBoard />
            <FutureTimeline />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-16 pb-8"
        >
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
          <p className="text-xs text-muted-foreground/60 tracking-wide max-w-md mx-auto leading-relaxed">
            "People don't fail at saving money because they lack tools… they fail because it's boring."
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
