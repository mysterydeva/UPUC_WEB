"use client";

import { useState } from "react";
import {
    Users,
    Target,
    Send,
    Mail,
    Phone,
    Calendar,
    MessageSquare,
    TrendingUp,
    Plus,
    Filter,
    ArrowUpRight,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";

interface Lead {
    id: string;
    name: string;
    source: string;
    status: "New" | "Contacted" | "Interested" | "Converted" | "Lost";
    lastFollowUp: string;
    value: string;
}

const mockLeads: Lead[] = [
    { id: "L-001", name: "Premium Apartments", source: "Google Ads", status: "Interested", lastFollowUp: "2 days ago", value: "₹ 12.5L" },
    { id: "L-002", name: "Commercial Plaza A", source: "Website", status: "New", lastFollowUp: "Today", value: "₹ 4.2L" },
    { id: "L-003", name: "Modern Villas", source: "Referral", status: "Contacted", lastFollowUp: "Yesterday", value: "₹ 8.8L" },
];

export default function MarketingPage() {
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

    return (
        <div className="space-y-10 pb-12">
            <PageHeader
                title="Marketing & CRM"
                description="Manage leads, broadcast updates, and track conversions."
                icon={<Target size={24} />}
                iconBgColor="bg-purple-500/10"
                iconColor="text-purple-600"
            >
                <div className="flex items-center gap-3">
                    <button className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-2 text-sm font-medium text-text-secondary">
                        <MessageSquare size={18} /> Broadcast
                    </button>
                    <button
                        onClick={() => setIsCreatingCampaign(true)}
                        className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95"
                    >
                        <Plus size={20} /> New Campaign
                    </button>
                </div>
            </PageHeader>

            {/* Funnel Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "New Leads", value: "142", icon: <Users size={20} />, color: "text-blue-500" },
                    { label: "Conversion", value: "18.4%", icon: <TrendingUp size={20} />, color: "text-emerald-500" },
                    { label: "Pipeline Value", value: "₹ 42.5L", icon: <Target size={20} />, color: "text-purple-500" },
                    { label: "Campaign ROI", value: "4.2x", icon: <Send size={20} />, color: "text-orange-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 premium-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-black text-text-secondary uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* CRM List */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 premium-shadow overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Users size={20} className="text-zinc-400" /> Active Pipeline
                    </h3>
                    <div className="flex items-center gap-2">
                        <button className="p-3 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-100 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50/50 text-left text-xs font-black text-text-secondary uppercase tracking-widest">
                                <th className="px-10 py-5">Lead Source</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Last Activity</th>
                                <th className="px-6 py-5">Est. Value</th>
                                <th className="px-10 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {mockLeads.map((lead, i) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={lead.id}
                                    className="hover:bg-zinc-50 transition-colors group"
                                >
                                    <td className="px-10 py-6">
                                        <div className="font-bold text-primary text-base">{lead.name}</div>
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                            <Send size={10} /> {lead.source}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            lead.status === "Interested" ? "bg-purple-50 text-purple-600" :
                                                lead.status === "New" ? "bg-blue-50 text-blue-600" :
                                                    "bg-zinc-100 text-zinc-500"
                                        )}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-xs font-bold text-text-secondary flex items-center gap-2">
                                            <Calendar size={14} className="text-zinc-300" /> {lead.lastFollowUp}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-black text-primary">{lead.value}</td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"><Phone size={16} /></button>
                                            <button className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100"><Mail size={16} /></button>
                                            <button className="p-2 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-100"><ArrowUpRight size={16} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Campaign Modal */}
            <AnimatePresence>
                {isCreatingCampaign && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreatingCampaign(false)}
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
                                    <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Mail size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">New Campaign</h3>
                                        <p className="text-xs text-text-secondary">Broadcast updates to your customer base.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreatingCampaign(false)}
                                    className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsCreatingCampaign(false); }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Campaign Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" className="py-4 rounded-2xl border-2 border-purple-500 bg-purple-50 text-purple-600 font-bold text-sm flex items-center justify-center gap-2">
                                            <Mail size={18} /> Email Push
                                        </button>
                                        <button type="button" className="py-4 rounded-2xl border border-zinc-100 bg-white text-zinc-400 font-bold text-sm flex items-center justify-center gap-2">
                                            <MessageSquare size={18} /> WhatsApp
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Target Segment</label>
                                    <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500/10">
                                        <option>All Past Customers</option>
                                        <option>Active Leads only</option>
                                        <option>Bulk Buyers (₹ 5L+)</option>
                                        <option>Inactive (60 days+)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Message Content</label>
                                    <textarea rows={4} className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500/10 resize-none" placeholder="Write your announcement here..."></textarea>
                                </div>

                                <button className="w-full py-5 bg-purple-600 text-white rounded-[2rem] font-bold hover:bg-purple-700 transition-all premium-shadow mt-4">
                                    Launch Campaign
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
