import { useLocation } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    income: "",
    spending: "",
    goal: ""
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else setLocation("/dashboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.05] via-black to-black z-0" />
      
      <div className="w-full max-w-md z-10 relative">
        <div className="mb-12 flex justify-between items-center px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/20'}`} />
            </div>
          ))}
        </div>

        <div className="h-[300px] relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <h1 className="text-4xl font-bold mb-4 tracking-tight">What's your monthly baseline?</h1>
                <p className="text-zinc-400 mb-8 text-lg">Your present self needs a starting point.</p>
                <div className="space-y-2">
                  <Label htmlFor="income" className="text-zinc-500 uppercase tracking-wider text-xs">Monthly Income</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">$</span>
                    <Input 
                      id="income"
                      type="number"
                      autoFocus
                      placeholder="0.00"
                      className="pl-10 h-16 text-2xl bg-white/5 border-white/10 focus-visible:ring-white/20 text-white placeholder:text-zinc-700 rounded-xl"
                      value={formData.income}
                      onChange={(e) => setFormData({...formData, income: e.target.value})}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <h1 className="text-4xl font-bold mb-4 tracking-tight">How much usually escapes?</h1>
                <p className="text-zinc-400 mb-8 text-lg">Be honest with your chaotic future self.</p>
                <div className="space-y-2">
                  <Label htmlFor="spending" className="text-zinc-500 uppercase tracking-wider text-xs">Average Monthly Spend</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">$</span>
                    <Input 
                      id="spending"
                      type="number"
                      autoFocus
                      placeholder="0.00"
                      className="pl-10 h-16 text-2xl bg-white/5 border-white/10 focus-visible:ring-white/20 text-white placeholder:text-zinc-700 rounded-xl"
                      value={formData.spending}
                      onChange={(e) => setFormData({...formData, spending: e.target.value})}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <h1 className="text-4xl font-bold mb-4 tracking-tight">What are you building toward?</h1>
                <p className="text-zinc-400 mb-8 text-lg">Your disciplined future self is listening.</p>
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-zinc-500 uppercase tracking-wider text-xs">Target Savings Goal</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">$</span>
                    <Input 
                      id="goal"
                      type="number"
                      autoFocus
                      placeholder="0.00"
                      className="pl-10 h-16 text-2xl bg-white/5 border-white/10 focus-visible:ring-white/20 text-white placeholder:text-zinc-700 rounded-xl"
                      value={formData.goal}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={nextStep}
            size="lg"
            className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 text-lg font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            {step === 3 ? 'Enter Command Center' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}