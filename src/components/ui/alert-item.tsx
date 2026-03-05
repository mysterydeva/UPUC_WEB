import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface AlertProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color?: string;
    bgColor?: string;
    className?: string;
}

export function AlertItem({ title, subtitle, icon, color, bgColor, className }: AlertProps) {
    return (
        <div className={cn(
            "group p-4 rounded-2xl border border-zinc-50 hover:border-accent/10 hover:bg-accent/[0.02] transition-all cursor-pointer flex items-center gap-4",
            className
        )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bgColor, color)}>
                {icon}
            </div>
            <div className="flex-grow">
                <h4 className="font-bold text-primary text-sm">{title}</h4>
                <p className="text-xs text-text-secondary line-clamp-1">{subtitle}</p>
            </div>
            <ChevronRight size={16} className="text-zinc-300 group-hover:text-accent transition-colors" />
        </div>
    );
}
