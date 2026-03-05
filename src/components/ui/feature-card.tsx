import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    index?: number;
}

export function FeatureCard({ title, description, icon, color, index = 0 }: FeatureCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-3xl border border-zinc-100 hover:border-accent/20 hover:bg-accent/[0.02] transition-all group"
        >
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                color
            )}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
            <p className="text-text-secondary leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
