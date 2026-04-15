import { AppLayout } from "@/components/layout/AppLayout";
import { useGetDashboardSummary, useGetSpendingChart, useListTransactions } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Flame, Shield, Swords, Activity, Wallet, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Animated Future Score Meter
const FutureScoreMeter = ({ score }: { score: number }) => {
  const normalizedScore = Math.min(Math.max(score, 0), 1000);
  const percentage = (normalizedScore / 1000) * 100;
  
  // Calculate stroke dasharray for arc
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * (circumference * 0.75); // 0.75 for an arc that doesn't fully close
  
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-135" viewBox="0 0 200 200">
        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#score-gradient)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a1a1aa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold tracking-tighter"
        >
          {score}
        </motion.span>
        <span className="text-xs text-zinc-400 font-medium tracking-widest uppercase mt-1">Future Score</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: chartData, isLoading: isLoadingChart } = useGetSpendingChart();
  const { data: transactions, isLoading: isLoadingTransactions } = useListTransactions({ limit: 5 });

  if (isLoadingSummary || isLoadingChart || isLoadingTransactions) {
    return (
      <AppLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <Skeleton className="h-64 rounded-2xl bg-white/5" />
          <Skeleton className="h-64 rounded-2xl bg-white/5" />
          <Skeleton className="h-64 rounded-2xl bg-white/5" />
          <Skeleton className="h-96 md:col-span-2 rounded-2xl bg-white/5" />
          <Skeleton className="h-96 rounded-2xl bg-white/5" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <header className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="text-zinc-400">Welcome back. Your future self is watching.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
              <Flame className="w-4 h-4 text-white" />
              <span className="font-bold">{summary?.streak} Day Streak</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300 font-medium">Lvl {summary?.level} {summary?.avatarStage}</span>
            </div>
          </div>
        </header>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Wallet className="w-24 h-24" />
            </div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <p className="text-zinc-400 font-medium tracking-wider text-xs uppercase mb-2">Available Balance</p>
                <h2 className="text-5xl font-bold tracking-tighter">${summary?.balance.toLocaleString()}</h2>
              </div>
              <div className="flex items-center gap-2 mt-8">
                <span className="bg-white/10 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +{(summary?.savingsRate || 0)}% savings rate
                </span>
                <span className="text-zinc-500 text-xs">this month</span>
              </div>
            </div>
          </motion.div>

          {/* Future Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <FutureScoreMeter score={summary?.futureScore || 0} />
            <div className="absolute bottom-4 w-full px-6 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1 text-zinc-400">
                <Activity className="w-3 h-3" />
                <span>Impact:</span>
              </div>
              <span className={cn(
                "font-medium px-2 py-0.5 rounded",
                (summary?.scoreChange || 0) > 0 ? "bg-white/10 text-white" : "bg-red-500/20 text-red-400"
              )}>
                {(summary?.scoreChange || 0) > 0 ? "+" : ""}{summary?.scoreChange} this week
              </span>
            </div>
          </motion.div>

          {/* Monthly Spend Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6 flex flex-col justify-between"
          >
            <div>
              <p className="text-zinc-400 font-medium tracking-wider text-xs uppercase mb-2">Monthly Spend</p>
              <h2 className="text-3xl font-bold tracking-tighter">${summary?.monthlySpend.toLocaleString()}</h2>
            </div>
            
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Savings Target</span>
                  <span className="text-white font-medium">${summary?.monthlySavings.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">Quests</span>
                </div>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">{summary?.pendingQuestsCount} pending</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spending Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-6 md:col-span-2"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">Spending Velocity</h3>
                <p className="text-xs text-zinc-400">Last 7 days vs previous week</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">${chartData?.totalThisWeek.toLocaleString()}</p>
                <p className={cn(
                  "text-xs font-medium flex items-center justify-end gap-1",
                  (chartData?.weekOverWeekChange || 0) < 0 ? "text-white" : "text-red-400"
                )}>
                  {(chartData?.weekOverWeekChange || 0) < 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  {Math.abs(chartData?.weekOverWeekChange || 0)}%
                </p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData?.points || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Signals</h3>
              <button className="text-xs text-zinc-400 hover:text-white transition-colors">View All</button>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {transactions?.map((tx, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={tx.id} 
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      {tx.type === 'debit' ? <ArrowDownRight className="w-4 h-4 text-zinc-300" /> : <ArrowUpRight className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.description}</p>
                      <p className="text-xs text-zinc-500">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", tx.type === 'credit' ? "text-white" : "")}>
                      {tx.type === 'debit' ? '-' : '+'}${tx.amount}
                    </p>
                    <p className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded inline-block mt-1",
                      tx.impactScore > 0 ? "bg-white/10 text-white" : (tx.impactScore < 0 ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-400")
                    )}>
                      Score {tx.impactScore > 0 ? '+' : ''}{tx.impactScore}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}