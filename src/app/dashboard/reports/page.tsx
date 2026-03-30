"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
    Target,
    Wallet,
    Landmark,
    Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { generateGSTR1JSON, exportTallyCSV, getFinancialStatements } from "@/app/actions/report-actions";

export default function ReportsPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [financials, setFinancials] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isBuildingReport, setIsBuildingReport] = useState(false);
    const [refreshingAI, setRefreshingAI] = useState(false);

    useEffect(() => {
        if (businessId) {
            getFinancialStatements(businessId).then(data => {
                setFinancials(data);
                setLoading(false);
            });
        }
    }, [businessId]);

    const handleGSTRDownload = async () => {
        if (!businessId) return;
        const json = await generateGSTR1JSON(businessId, new Date().getMonth() + 1, new Date().getFullYear());
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GSTR1_${businessId}_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
    };

    const handleTallyExport = async () => {
        if (!businessId) return;
        const csv = await exportTallyCSV(businessId);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `TALLY_EXPORT_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

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
                        <h2 className="text-2xl font-bold text-primary">Financial Statements & Reports</h2>
                        <p className="text-sm text-text-secondary">Real-time P&L, Banking LEDGERS, and Tax Exporters.</p>
                    </div>
                </div>
            </div>

            {/* Financial Statements (P&L, Balance, Cash Flow) */}
            {financials && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-[2rem] bg-indigo-600 text-white premium-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-20">
                            <TrendingUp size={80} />
                        </div>
                        <p className="text-indigo-200 font-bold tracking-widest uppercase text-xs mb-2">Net Profit & Loss</p>
                        <h3 className="text-3xl font-black mb-4">₹{financials.netProfit.toLocaleString()}</h3>
                        <div className="text-sm text-indigo-100 space-y-1">
                            <p>Revenue: ₹{financials.revenue.toLocaleString()}</p>
                            <p>Expenses: ₹{financials.expenses.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-[2rem] border border-zinc-100 bg-white premium-shadow">
                        <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs mb-2">Cash Flow (Assets)</p>
                        <h3 className="text-3xl font-black text-primary mb-4">₹{financials.assets.toLocaleString()}</h3>
                        <p className="text-sm text-zinc-500 font-medium">Total liquid cash across all connected bank accounts.</p>
                    </div>
                    <div className="p-6 rounded-[2rem] border border-zinc-100 bg-white premium-shadow">
                        <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs mb-2">Balance Sheet (Liabilities)</p>
                        <h3 className="text-3xl font-black text-error mb-4">₹{financials.liabilities.toLocaleString()}</h3>
                        <p className="text-sm text-zinc-500 font-medium">Total pending accounts receivable / overdue invoices.</p>
                    </div>
                </div>
            )}

            {/* Tax & Exporters */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-8">
                <h3 className="text-xl font-bold text-primary tracking-tight flex items-center gap-3">
                    <FileText className="text-indigo-500" /> Tax Exporters & Compliance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl border border-zinc-100 hover:border-indigo-500/20 hover:bg-zinc-50 transition-all flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-primary mb-2">GSTR-1 JSON Generator</h4>
                            <p className="text-sm text-zinc-500">Generate official B2B/B2C JSON files for direct upload to the GST Offline Tool.</p>
                        </div>
                        <button onClick={handleGSTRDownload} className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex justify-center items-center gap-2">
                            <Download size={18} /> Download JSON
                        </button>
                    </div>
                    <div className="p-6 rounded-3xl border border-zinc-100 hover:border-indigo-500/20 hover:bg-zinc-50 transition-all flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-primary mb-2">GSTR-3B Summary</h4>
                            <p className="text-sm text-zinc-500">Consolidated summary of outward supplies and input tax credit.</p>
                        </div>
                        <button onClick={() => alert("Generating GSTR-3B PDF...")} className="mt-6 w-full py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex justify-center items-center gap-2">
                            <Download size={18} /> View Summary
                        </button>
                    </div>
                    <div className="p-6 rounded-3xl border border-zinc-100 bg-blue-50/50 hover:bg-blue-50 transition-all flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-blue-900 mb-2">Tally ERP 9 Export</h4>
                            <p className="text-sm text-blue-700">Export all sales and receipts directly into Tally compatible CSV formats.</p>
                        </div>
                        <button onClick={handleTallyExport} className="mt-6 w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                            <Download size={18} /> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Insight Sidebar */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Hidden Chart space for layout balance */}
                </div>
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
                                <h3 className="text-lg font-bold tracking-tight">AI Tax Insights</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <motion.div
                                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2"
                            >
                                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-2">
                                    <Target size={12} /> Filing Reminder
                                </p>
                                <p className="text-sm leading-relaxed">
                                    GSTR-1 filing for the current month is due on the 11th. You have 4 unverified B2B invoices.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
