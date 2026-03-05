"use client";

import { useState, useMemo } from "react";
import {
    Wallet,
    ArrowDownLeft,
    Search,
    Download,
    MoreVertical,
    Banknote,
    Receipt,
    FileText,
    X,
    CreditCard,
    Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";

export default function FinancePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

    const initialInvoices = [
        { id: "INV-001", client: "Build Corp India", date: "Feb 24, 2026", amount: "₹4,25,000", status: "Paid", method: "Bank Transfer" },
        { id: "INV-002", client: "Private Residence", date: "Feb 20, 2026", amount: "₹1,12,000", status: "Pending", method: "Cheque" },
        { id: "INV-003", client: "Innovate Hub", date: "Feb 15, 2026", amount: "₹85,000", status: "Overdue", method: "Bank Transfer" },
        { id: "INV-004", client: "Skyline Tower A", date: "Feb 10, 2026", amount: "₹12,40,000", status: "Paid", method: "Wire" },
        { id: "INV-005", client: "Heritage Group", date: "Feb 05, 2026", amount: "₹2,10,000", status: "Pending", method: "UPI" },
    ];

    const statuses = ["All", "Paid", "Pending", "Overdue"];

    const filteredInvoices = useMemo(() => {
        return initialInvoices.filter(inv => {
            const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === "All" || inv.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus]);

    const financialStats = [
        { label: "Total Revenue", value: "₹ 45.2L", trend: "+12.5%", icon: <Banknote size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Accounts Receivable", value: "₹ 12.8L", trend: "-2.4%", icon: <Receipt size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Total Expenses", value: "₹ 8.4L", trend: "+5.1%", icon: <ArrowDownLeft size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Financial Management"
                description="Track payments, invoices, and your company's financial health."
                icon={<Wallet size={24} />}
                iconBgColor="bg-emerald-500/10"
                iconColor="text-emerald-600"
            >
                <div className="flex items-center gap-3">
                    <button className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm font-medium text-text-secondary">
                        <Download size={18} /> Financial Report
                    </button>
                    <button
                        onClick={() => setIsCreatingInvoice(true)}
                        className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                    >
                        Create Invoice
                    </button>
                </div>
            </PageHeader>

            {/* Finance Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {financialStats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-zinc-100 premium-shadow group hover:border-emerald-500/20 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                {stat.icon}
                            </div>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold",
                                stat.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-4xl font-bold text-primary tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cost Breakdown Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                <div className="lg:col-span-1 bg-zinc-900 rounded-[2.5rem] p-8 text-white premium-shadow relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">Costing Summary</h3>
                            <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="space-y-6 flex-grow">
                            {[
                                { label: "Material Cost", value: "₹ 12.4L", percentage: 65, color: "bg-blue-400" },
                                { label: "Bending Cost", value: "₹ 1.2L", percentage: 8, color: "bg-emerald-400" },
                                { label: "Hardware Cost", value: "₹ 3.4L", percentage: 18, color: "bg-orange-400" },
                                { label: "Glass Cost", value: "₹ 2.1L", percentage: 12, color: "bg-purple-400" },
                                { label: "Transport", value: "₹ 45k", percentage: 2, color: "bg-zinc-400" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-zinc-400">{item.label}</span>
                                        <span>{item.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            className={cn("h-full rounded-full", item.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Net Profit (P&L)</span>
                                <span className="text-2xl font-bold text-emerald-400">+₹ 4.1L</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all" />
                </div>

                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                            <FileText size={20} className="text-zinc-400" /> Recent Invoices
                        </h3>
                        <div className="flex items-center gap-2">
                            {statuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => setActiveStatus(status)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                                        activeStatus === status ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-zinc-50 text-text-secondary hover:bg-zinc-100"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-zinc-50/50 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">
                                    <th className="px-8 py-5">Invoice ID</th>
                                    <th className="px-6 py-5">Client Name</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5">Amount</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Method</th>
                                    <th className="px-6 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filteredInvoices.length > 0 ? filteredInvoices.map((inv, i) => (
                                    <motion.tr
                                        key={inv.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-zinc-50 transition-colors group"
                                    >
                                        <td className="px-8 py-5 font-bold text-primary font-mono text-sm uppercase tracking-tighter">{inv.id}</td>
                                        <td className="px-6 py-5 font-medium text-text-secondary">{inv.client}</td>
                                        <td className="px-6 py-5 text-sm font-medium text-zinc-400">{inv.date}</td>
                                        <td className="px-6 py-5 font-bold text-primary">{inv.amount}</td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                                                inv.status === "Paid" ? "bg-emerald-50 text-emerald-600" :
                                                    inv.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                        "bg-red-50 text-red-600"
                                            )}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                                                <div className="w-2 h-2 rounded-full bg-zinc-200" />
                                                {inv.method}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 rounded-lg hover:bg-zinc-200/50 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-10 text-center text-text-secondary italic">
                                            No invoices found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Invoice Modal */}
            <AnimatePresence>
                {isCreatingInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreatingInvoice(false)}
                            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-xl p-10 premium-shadow overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">Generate New Invoice</h3>
                                        <p className="text-xs text-text-secondary">Send a professional billing request to your client.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreatingInvoice(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsCreatingInvoice(false); }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Client Selection</label>
                                    <select className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10">
                                        <option>Build Corp India</option>
                                        <option>Innovate Hub</option>
                                        <option>Skyline Tower A</option>
                                        <option>Heritage Group</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Total Amount</label>
                                        <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" placeholder="₹ 0.00" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Due Date</label>
                                        <input type="date" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Payment Notes</label>
                                    <textarea rows={2} className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 resize-none" placeholder="Bank details, terms, etc."></textarea>
                                </div>

                                <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all premium-shadow mt-4">
                                    Finalize & Send Invoice
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
