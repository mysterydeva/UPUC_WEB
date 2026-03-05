"use client";

import { useState, useMemo } from "react";
import {
    UserPlus,
    Search,
    Plus,
    X,
    Phone,
    MapPin,
    User,
    Calendar,
    ArrowUpRight,
    MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Lead } from "@/types";

export default function LeadsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [isAddingLead, setIsAddingLead] = useState(false);

    const initialLeads: Lead[] = [
        { id: "LD-2024-001", clientName: "Rajesh Kumar", location: "Koramangala, Bangalore", contactNumber: "+91 98450 12345", status: "New", date: "2024-03-01" },
        { id: "LD-2024-002", clientName: "Sneha Reddy", location: "Indiranagar, Bangalore", contactNumber: "+91 98450 67890", status: "Follow-up", date: "2024-02-28" },
        { id: "LD-2024-003", clientName: "Buildwell Developers", location: "Whitefield, Bangalore", contactNumber: "+91 80 2345 6789", status: "Converted", date: "2024-02-25" },
        { id: "LD-2024-004", clientName: "Amitabh Bachchan", location: "Juhu, Mumbai", contactNumber: "+91 22 1234 5678", status: "Lost", date: "2024-02-20" },
    ];

    const statuses = ["All", "New", "Follow-up", "Converted", "Lost"];

    const filteredLeads = useMemo(() => {
        return initialLeads.filter(lead => {
            const matchesSearch = lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = activeStatus === "All" || lead.status === activeStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, activeStatus]);

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Leads & Measurements"
                description="Collect enquiry details and track customer measurements."
                icon={<UserPlus size={24} />}
                iconBgColor="bg-orange-500/10"
                iconColor="text-orange-600"
            >
                <button
                    onClick={() => setIsAddingLead(true)}
                    className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                >
                    <Plus size={20} /> Capture New Lead
                </button>
            </PageHeader>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search leads by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 premium-shadow text-sm"
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
                                    ? "bg-orange-600 text-white premium-shadow"
                                    : "bg-white text-text-secondary hover:bg-zinc-50 border border-zinc-100"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredLeads.length > 0 ? filteredLeads.map((lead, i) => (
                        <motion.div
                            key={lead.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow p-8 hover:border-orange-500/20 transition-all flex flex-col gap-6 group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-text-secondary font-mono tracking-tighter bg-zinc-100 px-2 py-0.5 rounded uppercase">
                                            {lead.id}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                            lead.status === "Converted" ? "bg-emerald-50 text-emerald-600" :
                                                lead.status === "Lost" ? "bg-red-50 text-red-600" :
                                                    lead.status === "Follow-up" ? "bg-blue-50 text-blue-600" :
                                                        "bg-orange-50 text-orange-600"
                                        )}>
                                            {lead.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-primary group-hover:text-orange-600 transition-colors uppercase tracking-tight">{lead.clientName}</h3>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-300 hover:text-primary transition-all">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <Phone size={16} className="text-zinc-400" /> {lead.contactNumber}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <MapPin size={16} className="text-zinc-400" /> {lead.location}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                                    <Calendar size={16} className="text-zinc-400" /> Received: {lead.date}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                                <button className="h-9 px-4 rounded-xl bg-orange-50 text-orange-600 text-xs font-bold flex items-center gap-2 hover:bg-orange-100 transition-all">
                                    Measurement Details <ArrowUpRight size={14} />
                                </button>
                                <button className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all">
                                    Create Quotation
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-text-secondary italic">
                            No leads found matching your criteria.
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Lead Modal */}
            <AnimatePresence>
                {isAddingLead && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingLead(false)}
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
                                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                                        <UserPlus size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">Capture New Lead</h3>
                                        <p className="text-xs text-text-secondary">Record initial customer enquiry and contact info.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddingLead(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddingLead(false); }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Client Name</label>
                                    <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="e.g. John Doe" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Contact Number</label>
                                    <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="+91 ..." />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Location</label>
                                    <input type="text" className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/10" placeholder="City, Area" />
                                </div>

                                <button className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all premium-shadow mt-4">
                                    Save Enquiry Details
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
