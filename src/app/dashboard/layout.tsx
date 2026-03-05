"use client";

import { motion } from "framer-motion";
import {
    Users,
    Settings,
    LogOut,
    LayoutDashboard,
    Construction,
    Box,
    Wallet,
    BarChart2,
    Bell,
    Search,
    UserPlus,
    FileText,
    ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const sidebarItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
        { id: "leads", label: "Leads", icon: <UserPlus size={20} />, href: "/dashboard/leads" },
        { id: "quotations", label: "Quotations", icon: <FileText size={20} />, href: "/dashboard/quotations" },
        { id: "job-orders", label: "Job Orders", icon: <ClipboardList size={20} />, href: "/dashboard/job-orders" },
        { id: "projects", label: "Projects", icon: <Construction size={20} />, href: "/dashboard/projects" },
        { id: "inventory", label: "Inventory", icon: <Box size={20} />, href: "/dashboard/inventory" },
        { id: "finance", label: "Finance", icon: <Wallet size={20} />, href: "/dashboard/finance" },
        { id: "employees", label: "Employees", icon: <Users size={20} />, href: "/dashboard/employees" },
        { id: "reports", label: "Reports", icon: <BarChart2 size={20} />, href: "/dashboard/reports" },
    ];

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {/* Sidebar */}
            <aside className="w-72 glass border-r border-zinc-200 hidden lg:flex flex-col p-6 fixed h-full z-20">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center text-white font-bold text-xl premium-shadow">U</div>
                        <span className="text-xl font-bold tracking-tight text-primary">UPUC <span className="text-accent">ERP</span></span>
                    </Link>
                </div>

                <nav className="flex-grow space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group",
                                pathname === item.href
                                    ? "bg-primary text-white premium-shadow"
                                    : "text-text-secondary hover:bg-zinc-100/50 hover:text-primary"
                            )}
                        >
                            <span className={cn(
                                "transition-transform duration-300",
                                pathname === item.href ? "scale-110" : "group-hover:scale-110"
                            )}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-zinc-100 flex flex-col gap-2">
                    <Link href="/dashboard/settings" className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-text-secondary hover:bg-zinc-100 transition-colors font-medium text-sm">
                        <Settings size={18} /> Settings
                    </Link>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-error hover:bg-red-50 transition-colors font-bold text-sm"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow lg:ml-72 p-6 md:p-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-1">
                            {sidebarItems.find(item => item.href === pathname)?.label || "Dashboard"} Overview
                        </h1>
                        <h2 className="text-3xl font-bold text-primary">Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">{session?.user?.name || "User"}</span></h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input
                                type="text"
                                placeholder="Search analytics..."
                                className="pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl w-64 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all premium-shadow"
                            />
                        </div>
                        <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-secondary hover:text-primary transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-12 h-12 rounded-2xl bg-zinc-200 overflow-hidden border-2 border-white premium-shadow">
                            <img src={session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name || "Guest"}`} alt="user" />
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
