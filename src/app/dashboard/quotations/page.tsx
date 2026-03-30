"use client";

import { useState, useMemo, useEffect } from "react";
import {
    FileText,
    Search,
    Plus,
    X,
    Calculator,
    Download,
    ArrowUpRight,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Quotation, QuotationItem } from "@/types";

export default function QuotationsPage() {
    console.log('🔄 QuotationsPage component rendering');
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [isAddingQuotation, setIsAddingQuotation] = useState(false);
    const [quotations, setQuotations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const initialQuotations: Quotation[] = [
        {
            id: "QTN-2024-001",
            clientName: "Rajesh Kumar",
            location: "Koramangala, Bangalore",
            contactNumber: "+91 98450 12345",
            status: "Draft",
            date: "2024-03-01",
            totalAmount: 45000,
            items: []
        },
        {
            id: "QTN-2024-002",
            clientName: "Sneha Reddy",
            location: "Indiranagar, Bangalore",
            contactNumber: "+91 98450 67890",
            status: "Sent",
            date: "2024-02-28",
            totalAmount: 125000,
            items: []
        },
        {
            id: "QTN-2024-003",
            clientName: "Buildwell Developers",
            location: "Whitefield, Bangalore",
            contactNumber: "+91 80 2345 6789",
            status: "Approved",
            date: "2024-02-25",
            totalAmount: 850000,
            items: []
        },
    ];

    const loadQuotations = async () => {
        console.log('🚀 Starting loadQuotations function');
        try {
            setIsLoading(true);
            setError("");
            console.log('📦 Importing getQuotations action');
            
            const { getQuotations } = await import("@/app/actions/quotation-actions");
            console.log('📞 Calling getQuotations...');
            const res = await getQuotations();
            console.log('📊 getQuotations result:', res);
            
            if (res.success) {
                console.log('✅ Successfully loaded quotations:', res.quotations?.length);
                setQuotations(res.quotations || []);
            } else {
                console.log('❌ Failed to load quotations, using fallback data');
                setQuotations(initialQuotations);
            }
        } catch (err) {
            console.log('💥 Exception in loadQuotations:', err);
            setError("Failed to load quotations");
            setQuotations(initialQuotations);
            console.error(err);
        } finally {
            console.log('🏁 loadQuotations finished, setting isLoading to false');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('🎯 Quotations useEffect triggered');
        loadQuotations();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        const { updateQuotationStatus } = await import("@/app/actions/quotation-actions");
        await updateQuotationStatus(id, status);
        await loadQuotations();
    };

    const handleConvertToJobOrder = async (id: string) => {
        const { convertToJobOrder } = await import("@/app/actions/job-order-actions");
        await convertToJobOrder(id);
        await loadQuotations();
        alert("Converted to Job Order successfully!");
    };

    const statuses = ["All", "Draft", "Sent", "Approved", "Rejected"];

    const formatDate = (date: Date | string | null | undefined) => {
        console.log('📅 Formatting date:', date);
        if (!date) return 'N/A';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.toLocaleDateString();
        } catch {
            return 'N/A';
        }
    };

    const filteredQuotations = useMemo(() => {
        console.log('🔍 Filtering quotations:', { quotationsCount: quotations.length, searchQuery, activeStatus });
        const sourceData = quotations.length > 0 ? quotations : initialQuotations;
        return sourceData.filter(qtn => {
            const matchesSearch = (qtn.clientName || qtn.client).toLowerCase().includes(searchQuery.toLowerCase()) ||
                (qtn.quotationId || qtn.id).toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === "All" || qtn.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus, quotations]);

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Quotations"
                description="Generate, manage, and track professional quotations for clients."
                icon={<FileText size={24} />}
                iconBgColor="bg-blue-500/10"
                iconColor="text-blue-600"
            >
                <button
                    onClick={() => setIsAddingQuotation(true)}
                    className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                >
                    <Plus size={20} /> Create New Quotation
                </button>
            </PageHeader>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search quotations by client or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 premium-shadow text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={cn(
                                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                                activeStatus === status
                                    ? "bg-blue-600 text-white premium-shadow"
                                    : "bg-white text-text-secondary hover:bg-zinc-50 border border-zinc-100"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredQuotations.length > 0 ? filteredQuotations.map((qtn, i) => (
                        <motion.div
                            key={qtn.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow p-8 hover:border-blue-500/20 transition-all flex flex-col gap-6 group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-text-secondary font-mono tracking-tighter bg-zinc-100 px-2 py-0.5 rounded uppercase">
                                            {qtn.id}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                            qtn.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                qtn.status === "Rejected" ? "bg-red-50 text-red-600" :
                                                    qtn.status === "Sent" ? "bg-blue-50 text-blue-600" :
                                                        "bg-zinc-50 text-zinc-600"
                                        )}>
                                            {qtn.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-primary group-hover:text-blue-600 transition-colors uppercase tracking-tight">{qtn.clientName}</h3>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-300 hover:text-primary transition-all">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Value</span>
                                    <span className="text-xl font-bold text-primary">₹ {qtn.totalAmount?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Date Created</span>
                                    <span className="text-sm font-medium text-text-secondary">{formatDate(qtn.date)}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button onClick={() => window.print()} className="h-9 px-4 rounded-xl bg-zinc-50 text-text-secondary text-xs font-bold flex items-center gap-2 hover:bg-zinc-100 transition-all">
                                        <Download size={14} /> Download PDF
                                    </button>
                                    <button onClick={() => alert("Active quotations cannot be edited without a revision. Clone to draft to edit.")} className="h-9 px-4 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-2 hover:bg-blue-100 transition-all">
                                        Edit Details
                                    </button>
                                </div>
                                {qtn.status === "Approved" ? (
                                    <button onClick={() => handleConvertToJobOrder(qtn.id || qtn.quotationId)} className="h-9 px-4 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200">
                                        Convert to Job Order <ArrowUpRight size={14} />
                                    </button>
                                ) : (
                                    <button onClick={() => handleStatusUpdate(qtn.id || qtn.quotationId, qtn.status === "Sent" ? "Approved" : "Sent")} className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all">
                                        {qtn.status === "Sent" ? "Mark as Approved" : "Mark as Sent"}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-text-secondary italic">
                            No quotations found matching your criteria.
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Create Quotation Modal / Wizard */}
            <AnimatePresence>
                {isAddingQuotation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingQuotation(false)}
                            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-4xl p-10 premium-shadow overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Calculator size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">Generate Quotation</h3>
                                        <p className="text-xs text-text-secondary uppercase font-bold tracking-widest mt-1">Smart Self-Calculation Engine</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddingQuotation(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); setIsAddingQuotation(false); }}>
                                    {/* Client Info */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Client Name</label>
                                            <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="e.g. Skyline Tower" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Location</label>
                                            <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="City" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Contact</label>
                                            <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="+91 ..." />
                                        </div>
                                    </div>

                                    {/* Line Items */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Measurement Entries</h4>
                                            <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                <Plus size={14} /> Add Line Item
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {[1].map((_, idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-4 items-end bg-zinc-50/50 p-6 rounded-2xl border border-dashed border-zinc-200">
                                                    <div className="col-span-4 space-y-2">
                                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Description</label>
                                                        <input type="text" className="w-full px-4 py-2 bg-white border border-zinc-100 rounded-xl text-xs" placeholder="e.g. Sliding Window 3-Track" />
                                                    </div>
                                                    <div className="col-span-2 space-y-2">
                                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Width (mm)</label>
                                                        <input type="number" className="w-full px-4 py-2 bg-white border border-zinc-100 rounded-xl text-xs" placeholder="1200" />
                                                    </div>
                                                    <div className="col-span-2 space-y-2">
                                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Height (mm)</label>
                                                        <input type="number" className="w-full px-4 py-2 bg-white border border-zinc-100 rounded-xl text-xs" placeholder="1500" />
                                                    </div>
                                                    <div className="col-span-1 space-y-2">
                                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Qty</label>
                                                        <input type="number" className="w-full px-4 py-2 bg-white border border-zinc-100 rounded-xl text-xs" placeholder="1" />
                                                    </div>
                                                    <div className="col-span-2 space-y-2">
                                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Rate (sqft)</label>
                                                        <input type="number" className="w-full px-4 py-2 bg-white border border-zinc-100 rounded-xl text-xs" placeholder="450" />
                                                    </div>
                                                    <div className="col-span-1 pb-1 flex justify-end">
                                                        <button type="button" className="w-9 h-9 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cost Breakdown Summary */}
                                    <div className="bg-zinc-900 rounded-[2rem] p-8 text-white flex justify-between items-center group relative overflow-hidden">
                                        <div className="relative z-10">
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Calculated Quotation Value</p>
                                            <h4 className="text-4xl font-bold flex items-center gap-3">
                                                ₹ 0.00 <span className="text-xs font-medium text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">+ GST 18%</span>
                                            </h4>
                                        </div>
                                        <button className="relative z-10 px-8 py-4 bg-white text-zinc-900 rounded-2xl font-bold hover:bg-blue-50 transition-all premium-shadow flex items-center gap-2 group-hover:scale-105 active:scale-95">
                                            Initialize & Save Quotation <CheckCircle2 size={18} />
                                        </button>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[64px] group-hover:bg-blue-500/20 transition-all rounded-full" />
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
