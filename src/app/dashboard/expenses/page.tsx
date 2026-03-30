"use client";

import { useState } from "react";
import {
    Banknote,
    ArrowUpRight,
    Plus,
    Filter,
    Calendar,
    X,
    FileText,
    TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { createExpense } from "@/app/actions/expense-actions";

interface Expense {
    id: string;
    category: string;
    amount: number;
    date: string;
    status: "Approved" | "Pending" | "Rejected";
    note: string;
}

const mockExpenses: Expense[] = [
    { id: "EXP-101", category: "Raw Material", amount: 125000, date: "Feb 25, 2026", status: "Approved", note: "Bulk UPVC Profile Purchase" },
    { id: "EXP-102", category: "Utility", amount: 12400, date: "Feb 24, 2026", status: "Approved", note: "Electricity Bill - Factory" },
    { id: "EXP-103", category: "Salary", amount: 85000, date: "Feb 20, 2026", status: "Approved", note: "Fabrication Team (Week 3)" },
];

export default function ExpensesPage() {
    const [isAddingExpense, setIsAddingExpense] = useState(false);

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Expense Management"
                description="Track every rupee spent on operations and overheads."
                icon={<Banknote size={24} />}
                iconBgColor="bg-blue-500/10"
                iconColor="text-blue-600"
            >
                <div className="flex items-center gap-3">
                    <button className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm font-medium text-text-secondary">
                        <TrendingUp size={18} /> Analysis
                    </button>
                    <button
                        onClick={() => setIsAddingExpense(true)}
                        className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                    >
                        <Plus size={20} /> Add Expense
                    </button>
                </div>
            </PageHeader>

            {/* Expense Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "This Month", value: "₹ 2.45L", trend: "+8.2%", color: "bg-blue-500" },
                    { label: "Pending Approval", value: "₹ 12.8k", trend: "-5%", color: "bg-orange-500" },
                    { label: "Operating Margin", value: "32%", trend: "+2.4%", color: "bg-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 premium-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black text-text-secondary uppercase tracking-widest">{stat.label}</span>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                stat.trend.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>{stat.trend}</span>
                        </div>
                        <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Expense List */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                        <ArrowUpRight size={20} className="text-red-500" /> Outflow Journal
                    </h3>
                    <button className="p-3 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-100 transition-all">
                        <Filter size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50/50 text-left text-xs font-black text-text-secondary uppercase tracking-widest">
                                <th className="px-10 py-5">Expense ID</th>
                                <th className="px-6 py-5">Category</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-10 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {mockExpenses.map((exp, i) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={exp.id}
                                    className="hover:bg-zinc-50 transition-colors group"
                                >
                                    <td className="px-10 py-6 font-mono font-bold text-primary">{exp.id}</td>
                                    <td className="px-6 py-6">
                                        <div className="font-bold text-primary">{exp.category}</div>
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{exp.note}</div>
                                    </td>
                                    <td className="px-6 py-6 font-black text-primary">₹ {exp.amount.toLocaleString()}</td>
                                    <td className="px-6 py-6 text-sm font-bold text-zinc-400">{exp.date}</td>
                                    <td className="px-6 py-6">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            exp.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                        )}>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-2 rounded-xl text-zinc-300 hover:bg-white hover:text-primary transition-all">
                                            <FileText size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Expense Modal */}
            <AnimatePresence>
                {isAddingExpense && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingExpense(false)}
                            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[3rem] w-full max-w-xl p-10 premium-shadow overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Banknote size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary tracking-tight">Record Expense</h3>
                                        <p className="text-xs text-text-secondary">Track your outgoing business costs.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddingExpense(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" action={async (data) => {
                                const res = await createExpense(data);
                                if (res.success) {
                                    setIsAddingExpense(false);
                                    alert("Expense recorded successfully!");
                                } else {
                                    alert(res.error);
                                }
                            }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Category</label>
                                    <select name="category" className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10">
                                        <option>Raw Material</option>
                                        <option>Utility</option>
                                        <option>Salary/Labor</option>
                                        <option>Rent</option>
                                        <option>Marketing</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Amount (₹)</label>
                                        <input name="amount" type="number" step="0.01" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="0.00" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Date</label>
                                        <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Description / Note</label>
                                    <textarea name="note" rows={3} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 resize-none" placeholder="Add specific details about the expense..."></textarea>
                                </div>

                                <button type="submit" className="w-full py-5 bg-primary text-white rounded-[2rem] font-bold hover:bg-primary-light transition-all premium-shadow mt-4">
                                    Log Expense
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
