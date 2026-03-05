import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
  className?: string;
  index?: number;
}

export function StatCard({ title, value, icon, trend, color, className, index = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 bg-white rounded-[2rem] border border-zinc-100 premium-shadow group cursor-pointer",
        className
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
        color
      )}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-primary tracking-tight">{value}</h3>
          {trend && (
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-lg",
              trend.includes("+") ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-600"
            )}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
