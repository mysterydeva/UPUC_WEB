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
    Landmark,
    ReceiptText,
    ShieldAlert,
    Users2,
    Warehouse,
    ShoppingCart,
    Megaphone,
    CreditCard,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import ErrorBoundary from "@/components/ui/error-boundary";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const sidebarGroups = [
        {
            label: "Main",
            items: [
                { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
            ]
        },
        {
            label: "Sales & CRM",
            items: [
                { id: "leads", label: "Leads", icon: <UserPlus size={18} />, href: "/dashboard/leads" },
                { id: "quotations", label: "Quotations", icon: <FileText size={18} />, href: "/dashboard/quotations" },
                { id: "job-orders", label: "Job Orders", icon: <ClipboardList size={18} />, href: "/dashboard/job-orders" },
                { id: "projects", label: "Projects", icon: <Construction size={18} />, href: "/dashboard/projects" },
                { id: "parties", label: "Parties", icon: <Users2 size={18} />, href: "/dashboard/parties" },
                { id: "marketing", label: "Marketing", icon: <Megaphone size={18} />, href: "/dashboard/marketing" },
            ]
        },
        {
            label: "Finance & Billing",
            items: [
                { id: "finance", label: "Invoicing", icon: <Wallet size={18} />, href: "/dashboard/finance" },
                { id: "vouchers", label: "Vouchers", icon: <ReceiptText size={18} />, href: "/dashboard/vouchers" },
                { id: "banking", label: "Banking", icon: <Landmark size={18} />, href: "/dashboard/banking" },
                { id: "expenses", label: "Expenses", icon: <CreditCard size={18} />, href: "/dashboard/expenses" },
                { id: "reports", label: "Reports", icon: <BarChart2 size={18} />, href: "/dashboard/reports" },
            ]
        },
        {
            label: "Operations",
            items: [
                { id: "inventory", label: "Inventory", icon: <Box size={18} />, href: "/dashboard/inventory" },
                { id: "warehouses", label: "Warehouses", icon: <Warehouse size={18} />, href: "/dashboard/inventory/warehouses" },
                { id: "pos", label: "Point of Sale", icon: <ShoppingCart size={18} />, href: "/dashboard/pos" },
            ]
        }
    ];

    const allItems = sidebarGroups.flatMap(g => g.items);

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-zinc-200 hidden lg:flex flex-col fixed h-full z-20 print:hidden overflow-y-auto">
                <div className="flex items-center gap-3 px-5 pt-6 pb-4 sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-100">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 gradient-accent rounded-xl flex items-center justify-center text-white font-bold text-lg premium-shadow">U</div>
                        <span className="text-lg font-bold tracking-tight text-primary">UPUC <span className="text-accent">ERP</span></span>
                    </Link>
                </div>

                <nav className="flex-grow px-3 py-4 space-y-5">
                    {sidebarGroups.map((group) => (
                        <div key={group.label}>
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em] px-3 mb-1.5">{group.label}</p>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group",
                                                isActive
                                                    ? "bg-primary text-white premium-shadow"
                                                    : "text-text-secondary hover:bg-zinc-100/70 hover:text-primary"
                                            )}
                                        >
                                            <span className={cn("transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")}>
                                                {item.icon}
                                            </span>
                                            <span className="flex-1">{item.label}</span>
                                            {isActive && <ChevronRight size={14} className="opacity-60" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="px-3 pb-4 pt-3 border-t border-zinc-100 sticky bottom-0 bg-white/80 backdrop-blur-md space-y-1">
                    <Link href="/dashboard/settings/users" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-text-secondary hover:bg-zinc-100 transition-colors font-medium text-sm">
                        <Users size={16} /> Team & Access
                    </Link>
                    <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-text-secondary hover:bg-zinc-100 transition-colors font-medium text-sm">
                        <Settings size={16} /> Settings
                    </Link>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-error hover:bg-red-50 transition-colors font-bold text-sm"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow lg:ml-64 p-6 md:p-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 print:hidden">
                    <div>
                        <h1 className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-1">
                            {allItems.find(item => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))?.label || "Dashboard"} Overview
                        </h1>
                        <h2 className="text-3xl font-bold text-primary">Good Evening, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">{session?.user?.name || "User"}</span></h2>
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
                        <button className="w-11 h-11 glass rounded-2xl flex items-center justify-center text-text-secondary hover:text-primary transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-11 h-11 rounded-2xl bg-zinc-200 overflow-hidden border-2 border-white premium-shadow">
                            <img src={session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name || "Guest"}`} alt="user" />
                        </div>
                    </div>
                </header>

                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
        </div>
    );
}
