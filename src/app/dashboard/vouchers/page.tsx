"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    ReceiptText,
    Plus,
    FileSignature,
    ArrowUpRight,
    Search,
    Download,
    Printer
} from "lucide-react";
import { getVouchers, createVoucher } from "@/app/actions/voucher-actions";

export default function VouchersPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const loadData = async () => {
        if (!businessId) return;
        setLoading(true);
        const data = await getVouchers(businessId);
        setVouchers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [businessId]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!businessId) return;
        const formData = new FormData(e.currentTarget);
        await createVoucher({
            type: formData.get("type") as string,
            amount: parseFloat(formData.get("amount") as string) || 0,
            referenceType: formData.get("referenceType") as string,
            referenceId: formData.get("referenceId") as string,
            businessId
        });
        setShowCreate(false);
        loadData();
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <ReceiptText size={24} className="text-accent" />
                        Advanced Vouchers
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Issue Proforma Invoices, Delivery Challans, Credit & Debit Notes.
                    </p>
                </div>
                <button onClick={() => setShowCreate(true)} className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-bold flex items-center gap-2 hover:bg-primary-light transition-all premium-shadow">
                    <Plus size={16} /> Create Voucher
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-zinc-100 premium-shadow overflow-hidden">
                <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-zinc-100 text-primary text-sm font-bold rounded-lg">All</button>
                        <button className="px-4 py-2 text-zinc-500 hover:bg-zinc-50 text-sm font-bold rounded-lg">Proformas</button>
                        <button className="px-4 py-2 text-zinc-500 hover:bg-zinc-50 text-sm font-bold rounded-lg">Challans</button>
                        <button className="px-4 py-2 text-zinc-500 hover:bg-zinc-50 text-sm font-bold rounded-lg">Credit Notes</button>
                    </div>
                    <div className="relative hidden lg:block">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder="Search vouchers..." className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 w-64" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50">
                            <tr>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Voucher ID</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Type</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Reference</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Amount</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Status</th>
                                <th className="text-right text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <FileSignature size={32} className="text-zinc-300" />
                                            <p className="text-sm">No vouchers issued yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : vouchers.map((v) => (
                                <tr key={v.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-bold text-primary">
                                        {v.voucherId}
                                        <p className="text-[10px] text-zinc-400 font-mono">{new Date(v.date).toLocaleDateString()}</p>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-text-secondary">
                                        {v.type}
                                    </td>
                                    <td className="py-4 px-6">
                                        {v.referenceType ? (
                                            <div>
                                                <p className="text-xs font-bold text-primary">{v.referenceType}</p>
                                                <p className="text-[10px] text-zinc-500">{v.referenceId}</p>
                                            </div>
                                        ) : "-"}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-black text-primary">
                                        {v.amount > 0 ? `₹${v.amount.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-500 hover:text-accent hover:bg-orange-50 flex items-center justify-center transition-colors">
                                                <Printer size={14} />
                                            </button>
                                            <button className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-500 hover:text-primary hover:bg-zinc-200 flex items-center justify-center transition-colors">
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreate && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md premium-shadow">
                        <h3 className="text-xl font-bold text-primary mb-6">Issue Voucher</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Voucher Type</label>
                                <select name="type" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
                                    <option>Proforma Invoice</option>
                                    <option>Delivery Challan</option>
                                    <option>Credit Note</option>
                                    <option>Debit Note</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Amount (₹) (If applicable)</label>
                                <input name="amount" type="number" defaultValue="0" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Link To</label>
                                    <select name="referenceType" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
                                        <option value="">None</option>
                                        <option>Invoice</option>
                                        <option>Quotation</option>
                                        <option>Job Order</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Ref ID</label>
                                    <input name="referenceId" placeholder="INV-001" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-orange-600 transition-all">
                                    Issue Voucher
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
