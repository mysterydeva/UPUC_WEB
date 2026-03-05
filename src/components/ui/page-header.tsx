import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    icon,
    iconBgColor = "bg-primary/10",
    iconColor = "text-primary",
    children,
    className
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6", className)}>
            <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", iconBgColor, iconColor)}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-primary">{title}</h2>
                    <p className="text-sm text-text-secondary">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}
