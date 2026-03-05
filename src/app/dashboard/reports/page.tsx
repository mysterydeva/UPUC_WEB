"use client";

import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Download,
    FileText,
    PieChart,
    ChevronRight,
    Sparkles,
    Search,
    Plus,
    X,
    LineChart,
    Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isBuildingReport, setIsBuildingReport] = useState(false);
    const [refreshingAI, setRefreshingAI] = useState(false);

    const reportFiles = [
        { title: "Monthly Inventory Audit", type: "Inventory", date: "Feb 2026", size: "2.4 MB" },
        { title: "Project Margin Analysis", type: "Financial", date: "Jan 2026", size: "1.8 MB" },
        { title: "Site Installation Efficiency", type: "Operations", date: "Q1 2026", size: "4.2 MB" },
        { title: "Employee Payroll Summary", type: "HR", date: "Feb 2026", size: "1.1 MB" },
        { title: "VAT & Tax Compliance", type: "Financial", date: "Q4 2025", size: "3.5 MB" },
    ];

    const filteredReports = reportFiles.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRefreshAI = () => {
        setRefreshingAI(true);
        setTimeout(() => setRefreshingAI(false), 2000);
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Analytics & Insights</h2>
                        <p className="text-sm text-text-secondary">AI-driven reporting and performance tracking for your UPVC business.</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsBuildingReport(true)}
                    className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                >
                    <Plus size={20} /> Build Custom Report
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Performance Chart Simulation */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-primary tracking-tight">Installation Performance</h3>
                        </div>
                        <select className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-xs font-bold text-text-secondary outline-none">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                            <option>Current Year</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {[65, 45, 85, 55, 95, 75].map((val, i) => (
                            <div key={i} className="flex-grow flex flex-col items-center gap-4 group">
                                <div className="w-full relative h-full flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val}%` }}
                                        transition={{ delay: i * 0.1, duration: 1 }}
                                        className="w-full bg-indigo-500/10 rounded-t-xl group-hover:bg-indigo-500/20 transition-all border-x border-t border-indigo-100 relative"
                                    >
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: '30%' }}
                                            className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl"
                                        />
                                    </motion.div>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insight Sidebar */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white premium-shadow space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} />
                    </div>

                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                    <Sparkles size={20} className="text-indigo-200" />
                                </div>
                                <h3 className="text-lg font-bold tracking-tight">AI Insights</h3>
                            </div>
                            <button
                                onClick={handleRefreshAI}
                                className={cn("p-2 hover:bg-white/10 rounded-lg transition-all", refreshingAI && "animate-spin")}
                            >
                                <Plus size={18} className="rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <motion.div
                                key={refreshingAI ? 'ref' : 'val'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2"
                            >
                                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-2">
                                    <Target size={12} /> Efficiency Alert
                                </p>
                                <p className="text-sm leading-relaxed">
                                    Site installation speed at <b>Royal Heights</b> is 15% faster than company average. Recommend analyzing their workflow for other sites.
                                </p>
                            </motion.div>

                            <motion.div
                                key={refreshingAI ? 'ref2' : 'val2'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2"
                            >
                                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-2">
                                    <PieChart size={12} /> Procurement Tip
                                </p>
                                <p className="text-sm leading-relaxed">
                                    Glass prices are expected to rise by 8% next month. Consider advancing bulk hardware orders by 2 weeks.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports Directory */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow overflow-hidden mt-10">
                <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                        <FileText size={24} className="text-indigo-500" /> Report Directory
                    </h3>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Search reports by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-sm outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                    {filteredReports.map((report, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-6 rounded-3xl border border-zinc-100 hover:border-indigo-500/20 hover:bg-zinc-50/50 transition-all group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary">{report.title}</h4>
                                    <div className="flex items-center gap-3 text-xs font-medium text-text-secondary mt-1">
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-bold">{report.type}</span>
                                        <span>•</span>
                                        <span>{report.date}</span>
                                        <span>•</span>
                                        <span>{report.size}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-primary hover:text-white transition-all premium-shadow group-hover:scale-105 active:scale-95">
                                <Download size={20} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Build Report Modal */}
            <AnimatePresence>
                {isBuildingReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBuildingReport(false)}
                            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-2xl p-10 premium-shadow overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <LineChart size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary uppercase tracking-tight">Custom Report Builder</h3>
                                        <p className="text-xs text-text-secondary font-bold tracking-widest mt-1">Define Audit Parameters</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsBuildingReport(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsBuildingReport(false); }}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Report Module</label>
                                        <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all">
                                            <option>Project & Sites</option>
                                            <option>Inventory & Stock</option>
                                            <option>Financial Health</option>
                                            <option>HR & Payroll</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Data Grain</label>
                                        <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all">
                                            <option>Detailed Line Items</option>
                                            <option>Executive Summary</option>
                                            <option>Comparative Analysis</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Start Date</label>
                                        <input type="date" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">End Date</label>
                                        <input type="date" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                            <Download size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-indigo-900">Auto-email when ready?</p>
                                            <p className="text-xs text-indigo-700/60">We'll send it to dharshan@upuc.com</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-indigo-200 rounded-full relative p-1 cursor-pointer">
                                        <motion.div
                                            layout
                                            className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all premium-shadow mt-4 uppercase tracking-widest text-sm">
                                    Generate Analytical Report
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
