import { AppLayout } from "@/components/layout/AppLayout";
import { useGetFutureMessages } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, AlertTriangle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { data: messages, isLoading } = useGetFutureMessages();

  const getSenderConfig = (from: string) => {
    switch(from) {
      case 'disciplined':
        return { icon: Sparkles, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', label: 'Disciplined Self' };
      case 'chaotic':
        return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Chaotic Self' };
      default:
        return { icon: MessageSquare, color: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700', label: 'System' };
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Temporal Inbox</h1>
          <p className="text-zinc-400">Communications from your potential futures.</p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {messages?.map((msg, i) => {
              const config = getSenderConfig(msg.from);
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300",
                    !msg.read && "border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  )}
                >
                  {!msg.read && (
                    <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-white shadow-[0_0_5px_#fff]" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 border", config.bg, config.border)}>
                      <Icon className={cn("w-5 h-5", config.color)} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs font-bold uppercase tracking-wider", config.color)}>
                          {config.label}
                        </span>
                        <span className="text-xs text-zinc-500">•</span>
                        <span className="text-xs text-zinc-500">
                          {new Date(msg.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold tracking-tight mb-3 text-white">
                        {msg.subject}
                      </h3>
                      
                      <p className="text-zinc-300 leading-relaxed font-serif text-lg italic border-l-2 border-white/10 pl-4 py-1">
                        "{msg.body}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {messages?.length === 0 && (
              <div className="text-center py-20 text-zinc-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>The timeline is quiet. Keep building.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}