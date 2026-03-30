"use client";

import { useState, useMemo, useEffect } from "react";
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
    Plus,
    Tag,
    Calculator,
    Zap,
    QrCode,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { calculateGst, GstType } from "@/lib/gst-utils";
import { createInvoice } from "@/app/actions/invoice-actions";
import { useSession } from "next-auth/react";

interface DatabaseInvoice {
    id: string;
    invoiceId: string;
    client: string;
    subTotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    totalAmount: number;
    gstType?: string | null;
    status: string;
    method?: string | null;
    date: Date | string;
    dueDate: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export default function FinancePage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;
    
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const [invoices, setInvoices] = useState<DatabaseInvoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // New State for Invoice Creation
    const [formData, setFormData] = useState({
        client: "",
        subTotal: 0,
        taxRate: 18,
        discount: 0,
        gstType: "CGST_SGST" as GstType,
        dueDate: new Date().toISOString().split('T')[0]
    });

    const gstBreakdown = useMemo(() => {
        return calculateGst(formData.subTotal - formData.discount, formData.taxRate, formData.gstType);
    }, [formData.subTotal, formData.taxRate, formData.gstType, formData.discount]);

    const loadInvoices = async () => {
        try {
            setIsLoading(true);
            setError("");
            const { getInvoices } = await import("@/app/actions/invoice-actions");
            const result = await getInvoices(businessId);
            
            if (result.success) {
                setInvoices(result.invoices || []);
            } else {
                setError(result.error || "Failed to load invoices");
            }
        } catch (err) {
            setError("Failed to load invoices");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (businessId) {
            loadInvoices();
        }
    }, [businessId]);

    const statuses = ["All", "Paid", "Pending", "Overdue"];

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === "All" || inv.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus, invoices]);

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
                    <button onClick={() => alert("Generating PDF Financial Report...")} className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm font-medium text-text-secondary">
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
                                        <td className="px-6 py-5 text-sm font-medium text-zinc-400">
                                            {typeof inv.date === 'string' ? new Date(inv.date).toLocaleDateString() : inv.date.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-primary">{inv.totalAmount}</td>
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

                            <form className="space-y-6" action={async (data) => {
                                const res = await createInvoice(data);
                                if (res.success) {
                                    setIsCreatingInvoice(false);
                                    setFormData({ ...formData, subTotal: 0, discount: 0 }); // Reset essential fields
                                    alert("Invoice generated successfully!");
                                } else {
                                    alert(res.error);
                                }
                            }}>
                                <input type="hidden" name="gstType" value={formData.gstType} />

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Client Selection</label>
                                    <select
                                        name="client"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10"
                                    >
                                        <option>Build Corp India</option>
                                        <option>Innovate Hub</option>
                                        <option>Skyline Tower A</option>
                                        <option>Heritage Group</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Subtotal (Net)</label>
                                        <div className="relative">
                                            <input
                                                name="subTotal"
                                                type="number"
                                                value={formData.subTotal || ""}
                                                onChange={(e) => setFormData({ ...formData, subTotal: parseFloat(e.target.value) || 0 })}
                                                className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10"
                                                placeholder="0.00"
                                            />
                                            <Calculator size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Tax Rate (%)</label>
                                        <select
                                            name="taxRate"
                                            value={formData.taxRate}
                                            onChange={(e) => setFormData({ ...formData, taxRate: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10"
                                        >
                                            <option value={5}>5% (Basic)</option>
                                            <option value={12}>12% (Standard)</option>
                                            <option value={18}>18% (Service/General)</option>
                                            <option value={28}>28% (Luxury)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">GST Type</label>
                                        <div className="flex bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gstType: "CGST_SGST" })}
                                                className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", formData.gstType === "CGST_SGST" ? "bg-white shadow-sm text-primary" : "text-zinc-400")}
                                            >
                                                Intra-state
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gstType: "IGST" })}
                                                className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", formData.gstType === "IGST" ? "bg-white shadow-sm text-primary" : "text-zinc-400")}
                                            >
                                                Inter-state
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Due Date</label>
                                        <input
                                            name="dueDate"
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>

                                {/* GST Breakdown Preview */}
                                <div className="bg-zinc-900 rounded-2xl p-6 text-white space-y-3">
                                    <div className="flex justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                        <span>Subtotal</span>
                                        <span>₹ {formData.subTotal.toLocaleString()}</span>
                                    </div>
                                    {formData.gstType === "CGST_SGST" ? (
                                        <>
                                            <div className="flex justify-between text-xs text-emerald-400/80 font-bold uppercase tracking-wider">
                                                <span>CGST ({(formData.taxRate / 2).toFixed(1)}%)</span>
                                                <span>₹ {gstBreakdown.cgst.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-emerald-400/80 font-bold uppercase tracking-wider">
                                                <span>SGST ({(formData.taxRate / 2).toFixed(1)}%)</span>
                                                <span>₹ {gstBreakdown.sgst.toLocaleString()}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between text-xs text-emerald-400/80 font-bold uppercase tracking-wider">
                                            <span>IGST ({formData.taxRate}%)</span>
                                            <span>₹ {gstBreakdown.igst.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-sm font-bold text-zinc-300">Total Amount</span>
                                        <span className="text-2xl font-black text-emerald-400">₹ {gstBreakdown.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-zinc-100 mt-6 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-primary">Compliance & e-Invoicing</h4>
                                        <button
                                            type="button"
                                            onClick={() => alert("IRN Generation triggered with mock JSON payload!")}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                                        >
                                            <Zap size={12} /> Generate IRN
                                        </button>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <div className="w-16 h-16 bg-white rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-300">
                                            <QrCode size={32} />
                                        </div>
                                        <div className="flex-grow space-y-1">
                                            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">IRN (Mocked)</div>
                                            <div className="text-xs font-mono text-primary truncate max-w-[200px]">48a92b...f7e10c</div>
                                            <div className="text-[10px] text-emerald-600 font-bold uppercase">Status: IRN Ready</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-100 mt-6 flex justify-between md:col-span-2">
                                    <button type="button" onClick={() => setIsCreatingInvoice(false)} className="h-10 px-4 rounded-xl text-primary text-xs font-bold hover:bg-zinc-50 transition-all border border-zinc-100">
                                        Cancel
                                    </button>
                                    <button type="submit" className="h-10 px-6 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all premium-shadow">
                                        Generate Bill
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
