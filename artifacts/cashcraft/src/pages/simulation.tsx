import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRunSimulation } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, AlertTriangle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Simulation() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("want");
  
  const runSimulation = useRunSimulation();
  const [hasSimulated, setHasSimulated] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    runSimulation.mutate({
      data: {
        amount: Number(amount),
        description,
        category
      }
    }, {
      onSuccess: () => {
        setHasSimulated(true);
      }
    });
  };

  const reset = () => {
    setHasSimulated(false);
    setAmount("");
    setDescription("");
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto flex flex-col h-full min-h-[calc(100vh-8rem)]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Timeline Splitter</h1>
          <p className="text-zinc-400">Simulate a purchase to see how your future branches.</p>
        </header>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {!hasSimulated ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="glass-card rounded-3xl p-8 max-w-md w-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Play className="w-32 h-32" />
                  </div>
                  
                  <form onSubmit={handleSimulate} className="relative z-10 space-y-6">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-zinc-500">Purchase Amount</Label>
                      <div className="relative mt-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">₹</span>
                        <Input 
                          type="number" 
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10 h-16 text-2xl bg-black/50 border-white/10 focus-visible:ring-white/20 rounded-xl"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-zinc-500">What is it?</Label>
                      <Input 
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2 h-14 bg-black/50 border-white/10 focus-visible:ring-white/20 rounded-xl"
                        placeholder="e.g. New iPad Pro"
                      />
                    </div>

                    <div>
                      <Label className="text-xs uppercase tracking-wider text-zinc-500 mb-3 block">Category</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          onClick={() => setCategory("need")}
                          className={cn(
                            "cursor-pointer px-4 py-3 rounded-xl border text-center text-sm font-medium transition-all",
                            category === "need" ? "bg-white text-black border-white" : "bg-black/50 border-white/10 text-zinc-400 hover:border-white/30"
                          )}
                        >
                          Need
                        </div>
                        <div 
                          onClick={() => setCategory("want")}
                          className={cn(
                            "cursor-pointer px-4 py-3 rounded-xl border text-center text-sm font-medium transition-all",
                            category === "want" ? "bg-white text-black border-white" : "bg-black/50 border-white/10 text-zinc-400 hover:border-white/30"
                          )}
                        >
                          Want
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={runSimulation.isPending}
                      className="w-full h-14 rounded-xl bg-white text-black hover:bg-zinc-200 text-base font-bold tracking-wide mt-4"
                    >
                      {runSimulation.isPending ? "Calculating timelines..." : "Run Simulation"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 h-full">
                  {/* Disciplined Future */}
                  <div className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col group hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 border border-white/5 hover:border-white/20">
                    <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                      <Sparkles className="w-32 h-32" />
                    </div>
                    
                    <div className="mb-auto">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold tracking-wider uppercase mb-6">
                        <Sparkles className="w-3 h-3" />
                        Disciplined Path
                      </div>
                      
                      <h2 className="text-3xl font-bold tracking-tight mb-2">You invest the ₹{amount}</h2>
                      <p className="text-zinc-400">By skipping this purchase, your capital works for you.</p>
                    </div>

                    <div className="space-y-6 mt-8 relative z-10">
                      <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">1 Year Projection</p>
                        <p className="text-2xl font-bold text-white">+₹{runSimulation.data?.disciplined.savingsIn1Year}</p>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-black/50 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Future Score Impact</p>
                        <p className="text-2xl font-bold text-green-400">+{runSimulation.data?.disciplined.scoreImpact}</p>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm italic text-zinc-400">"{runSimulation.data?.disciplined.message}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Chaotic Future */}
                  <div className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col group hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-all duration-500 border border-red-500/10 hover:border-red-500/30">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500 transition-opacity group-hover:opacity-10">
                      <AlertTriangle className="w-32 h-32" />
                    </div>
                    
                    <div className="mb-auto">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase mb-6">
                        <AlertTriangle className="w-3 h-3" />
                        Chaotic Path
                      </div>
                      
                      <h2 className="text-3xl font-bold tracking-tight mb-2">You buy the {description}</h2>
                      <p className="text-zinc-400">Instant gratification comes at a cost to future leverage.</p>
                    </div>

                    <div className="space-y-6 mt-8 relative z-10">
                      <div className="p-4 rounded-2xl bg-black/50 border border-red-500/10">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Lost Opportunity Cost (1Y)</p>
                        <p className="text-2xl font-bold text-zinc-300">-₹{runSimulation.data?.chaotic.savingsIn1Year}</p>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-black/50 border border-red-500/10">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Future Score Impact</p>
                        <p className="text-2xl font-bold text-red-400">{runSimulation.data?.chaotic.scoreImpact}</p>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm italic text-zinc-400">"{runSimulation.data?.chaotic.message}"</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={reset}
                    variant="outline"
                    className="rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 px-8"
                  >
                    Run Another Simulation
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}