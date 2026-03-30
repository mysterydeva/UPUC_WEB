"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart2,
    ChevronRight,
    TrendingUp,
    Banknote,
    Hammer,
    Clock,
    AlertTriangle
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { AlertItem } from "@/components/ui/alert-item";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const summaryCards = [
        { title: "Total Revenue", value: "₹ 45.2L", icon: <Banknote className="text-orange-600" />, trend: "+12.5%", color: "bg-orange-50" },
        { title: "Net Profit", value: "₹ 32.4L", icon: <TrendingUp className="text-emerald-600" />, trend: "+8.2%", color: "bg-emerald-50" },
        { title: "Ongoing Projects", value: "08", icon: <Hammer className="text-indigo-600" />, trend: "2 new", color: "bg-indigo-50" },
        { title: "Pending Invoices", value: "14", icon: <Clock className="text-amber-600" />, trend: "Due soon", color: "bg-amber-50" },
    ];

    const [chartFilter, setChartFilter] = useState("Last 6 Months");
    const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        import("@/app/actions/dashboard-actions").then((m) => {
            m.getDashboardAlerts().then((res) => {
                if (res.success) {
                    const newAlerts: any[] = [];
                    res.lowStock?.forEach((item: any) => {
                        newAlerts.push({
                            title: "Low Stock Warning",
                            subtitle: `${item.name} is below ${item.minStock}${item.unit}`,
                            icon: <AlertTriangle size={18} />,
                            color: "text-red-500",
                            bgColor: "bg-red-50"
                        });
                    });
                    res.overdueInvoices?.forEach((inv: any) => {
                        newAlerts.push({
                            title: "Overdue Invoice",
                            subtitle: `${inv.invoiceId} - ${inv.client}`,
                            icon: <Clock size={18} />,
                            color: "text-amber-500",
                            bgColor: "bg-amber-50"
                        });
                    });
                    setLiveAlerts(newAlerts);
                }
                setIsLoading(false);
            });
        });
    }, []);

    const alerts = isLoading ? [
        { title: "Loading alerts...", subtitle: "Please wait", icon: <Clock size={18} />, color: "text-zinc-500", bgColor: "bg-zinc-50" }
    ] : liveAlerts.length > 0 ? liveAlerts : [
        { title: "All Clear", subtitle: "No critical alerts at the moment", icon: <AlertTriangle size={18} />, color: "text-emerald-500", bgColor: "bg-emerald-50" }
    ];

    const chartData = chartFilter === "Last 12 Months"
        ? [30, 40, 45, 65, 35, 85, 55, 75, 90, 80, 60, 100]
        : [45, 65, 35, 85, 55, 75];

    return (
        <>
            {/* Business Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {summaryCards.map((card, idx) => (
                    <StatCard
                        key={idx}
                        index={idx}
                        {...card}
                    />
                ))}
            </div>

            {/* Analytics & Alerts */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart Card */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-primary">Monthly Profit Analytics</h3>
                        <select
                            value={chartFilter}
                            onChange={(e) => setChartFilter(e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/10"
                        >
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>
                    <div className="h-80 w-full bg-zinc-50 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col items-center gap-4">
                            <BarChart2 size={48} className="text-accent/20" />
                            <p className="text-text-secondary font-medium italic">Advanced fl-charts integration in progress...</p>
                        </div>
                        {/* Fake Graph Lines */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end px-12 gap-4 pb-12">
                            {chartData.map((h, i) => (
                                <motion.div
                                    key={i + chartFilter}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.2 + (i * 0.05), duration: 0.8 }}
                                    className="flex-grow bg-accent/20 hover:bg-accent/40 rounded-t-xl transition-colors"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Critical Alerts */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-primary">Critical Alerts</h3>
                            <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full">{liveAlerts.length} New</span>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {alerts.map((alert, idx) => (
                                <AlertItem
                                    key={idx}
                                    {...alert}
                                />
                            ))}
                        </div>

                        <button className="w-full mt-10 py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-text-secondary text-sm font-bold hover:border-accent/20 hover:text-accent hover:bg-accent/[0.01] transition-all">
                            View All Notification History
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
