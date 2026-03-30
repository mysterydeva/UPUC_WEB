"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ClipboardList,
    Search,
    Plus,
    X,
    ArrowUpRight,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    LayoutGrid,
    LayoutList,
    Printer,
    ArrowRightLeft,
    FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { JobOrder } from "@/types";

export default function JobOrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [jobOrders, setJobOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const loadJobOrders = async () => {
        setIsLoading(true);
        const { getJobOrders } = await import("@/app/actions/job-order-actions");
        const res = await getJobOrders();
        if (res.success) setJobOrders(res.jobOrders || []);
        else setJobOrders(initialOrders);
        setIsLoading(false);
    };

    useEffect(() => {
        loadJobOrders();
    }, []);

    const initialOrders: JobOrder[] = [
        { id: "JO-2024-001", quotationId: "QTN-2024-003", clientName: "Buildwell Developers", status: "In Production", date: "2024-03-01", serialNumber: "UPUC/JO/001" },
        { id: "JO-2024-002", quotationId: "QTN-2024-005", clientName: "Skyline Tower A", status: "Pending", date: "2024-02-28", serialNumber: "UPUC/JO/002" },
        { id: "JO-2024-003", quotationId: "QTN-2024-012", clientName: "Heritage Group", status: "Installation", date: "2024-02-25", serialNumber: "UPUC/JO/003" },
        { id: "JO-2024-004", quotationId: "QTN-2024-008", clientName: "Metro Mall", status: "Completed", date: "2024-02-20", serialNumber: "UPUC/JO/004" },
    ];

    const statuses = ["All", "Pending", "In Production", "Installation", "Completed"];

    const filteredOrders = useMemo(() => {
        const sourceData = jobOrders.length > 0 ? jobOrders : initialOrders;
        return sourceData.filter(order => {
            const matchesSearch = (order.clientName || order.client).toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.jobOrderId || order.serialNumber).toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === "All" || order.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus, jobOrders]);

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Job Orders"
                description="Track production progress and installation milestones for approved projects."
                icon={<ClipboardList size={24} />}
                iconBgColor="bg-emerald-500/10"
                iconColor="text-emerald-600"
            >
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm font-medium text-text-secondary"
                    >
                        <Printer size={18} /> Batch Print
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/quotations")}
                        className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                    >
                        <ArrowRightLeft size={20} /> Convert Quotation
                    </button>
                </div>
            </PageHeader>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Client, JO ID or S.No..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 premium-shadow text-sm"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-zinc-100/50 p-1 rounded-2xl border border-zinc-100">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn("p-2 rounded-xl transition-all", viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-zinc-400")}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn("p-2 rounded-xl transition-all", viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-zinc-400")}
                        >
                            <LayoutList size={18} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {statuses.map(status => (
                            <button
                                key={status}
                                onClick={() => setActiveStatus(status)}
                                className={cn(
                                    "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                                    activeStatus === status
                                        ? "bg-emerald-600 text-white premium-shadow"
                                        : "bg-white text-text-secondary hover:bg-zinc-50 border border-zinc-100"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredOrders.length > 0 ? filteredOrders.map((order, i) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow p-8 hover:border-emerald-500/20 transition-all flex flex-col gap-6 group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-text-secondary font-mono tracking-tighter bg-zinc-100 px-2 py-0.5 rounded uppercase">
                                                {order.serialNumber}
                                            </span>
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                order.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                                    order.status === "Pending" ? "bg-zinc-50 text-zinc-600" :
                                                        order.status === "Installation" ? "bg-blue-50 text-blue-600" :
                                                            "bg-orange-50 text-orange-600"
                                            )}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-primary group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{order.clientName}</h3>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-300 hover:text-primary transition-all">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                        <FileText size={14} /> Linked QTN: {order.quotationId}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                        <Clock size={14} /> Issued: {order.date}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                                    <button onClick={() => alert(`Viewing details for ${order.jobOrderId || order.id}`)} className="h-9 px-4 rounded-xl bg-zinc-50 text-primary text-xs font-bold flex items-center gap-2 hover:bg-zinc-100 transition-all">
                                        Order Details <ArrowUpRight size={14} />
                                    </button>
                                    <div className="flex -space-x-2">
                                        {[1, 2].map(x => (
                                            <div key={x} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                                USR
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center text-text-secondary italic">
                                No job orders found matching your criteria.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
                <div className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50/50 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">
                                <th className="px-8 py-5">S.No / ID</th>
                                <th className="px-6 py-5">Client Name</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Linked QTN</th>
                                <th className="px-6 py-5">Created</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredOrders.map((order, i) => (
                                <tr key={order.id} className="hover:bg-zinc-50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-primary font-mono text-sm">{order.serialNumber}</div>
                                        <div className="text-[10px] text-zinc-400 font-bold uppercase">{order.id}</div>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-primary active:text-emerald-600 transition-colors cursor-pointer">{order.clientName}</td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                                            order.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                                order.status === "Pending" ? "bg-zinc-50 text-zinc-600" :
                                                    order.status === "Installation" ? "bg-blue-50 text-blue-600" :
                                                        "bg-orange-50 text-orange-600"
                                        )}>
                                            {order.status === "In Production" && <Clock size={12} />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-zinc-400 font-mono">{order.quotationId}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-zinc-400">{order.date}</td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 rounded-lg hover:bg-emerald-50 text-zinc-300 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
