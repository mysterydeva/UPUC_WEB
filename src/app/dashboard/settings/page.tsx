"use client";

import { motion } from "framer-motion";
import {
    Settings,
    User,
    Building,
    Bell,
    Shield,
    Globe,
    Database,
    Key,
    Save,
    CheckCircle2,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const sections = [
        { id: "profile", label: "My Profile", icon: <User size={18} /> },
        { id: "org", label: "Organization", icon: <Building size={18} /> },
        { id: "notif", label: "Notifications", icon: <Bell size={18} /> },
        { id: "security", label: "Security", icon: <Shield size={18} /> },
        { id: "integrations", label: "Integrations", icon: <Database size={18} /> },
    ];

    return (
        <div className="space-y-10 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-500/10 flex items-center justify-center text-zinc-600">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-primary">System Settings</h2>
                        <p className="text-sm text-text-secondary">Configure your ERP preferences, security, and external integrations.</p>
                    </div>
                </div>

                <button className="h-11 px-8 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow flex items-center gap-2 text-sm font-bold active:scale-95">
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="grid lg:grid-cols-4 gap-10">
                {/* Settings Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                                activeTab === section.id
                                    ? "bg-white text-primary premium-shadow"
                                    : "text-text-secondary hover:bg-zinc-100 hover:text-primary"
                            )}
                        >
                            <span className={cn(activeTab === section.id ? "text-accent" : "text-zinc-400")}>
                                {section.icon}
                            </span>
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3 space-y-8">
                    {activeTab === "profile" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-6">
                                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                                    <User size={20} className="text-zinc-400" /> Account Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <input type="text" defaultValue="Dharshan R" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Job Title</label>
                                        <input type="text" defaultValue="Administrator" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Email Address</label>
                                        <input type="email" defaultValue="dharshan@upuc.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Phone Number</label>
                                        <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/10" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "org" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-6"
                        >
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <Building size={20} className="text-zinc-400" /> Organization Settings
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                    <p className="text-xs font-bold text-primary uppercase">Company Name</p>
                                    <p className="text-sm text-text-secondary">UPUC Fenestration Systems Pvt Ltd</p>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                                    <p className="text-xs font-bold text-primary uppercase">GSTIN / Tax ID</p>
                                    <p className="text-sm text-text-secondary">29AAAAA0000A1Z5</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "security" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-6"
                        >
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <Shield size={20} className="text-zinc-400" /> Security & Privacy
                            </h3>
                            <div className="space-y-4">
                                <button className="w-full py-4 px-6 border border-zinc-100 rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-all">
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-primary">Change Password</p>
                                        <p className="text-xs text-text-secondary">Last changed 3 months ago</p>
                                    </div>
                                    <ChevronRight size={18} className="text-zinc-300" />
                                </button>
                                <button className="w-full py-4 px-6 border border-zinc-100 rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-all">
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-primary">Two-Factor Authentication</p>
                                        <p className="text-xs text-emerald-600 font-bold">Currently Enabled</p>
                                    </div>
                                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative p-1">
                                        <div className="w-3 h-3 bg-white rounded-full absolute right-1" />
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "integrations" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Key size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary">ERP API Config</h3>
                                    <p className="text-sm text-text-secondary">Integrate with external tracking services.</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Public API Key</label>
                                <div className="flex gap-2">
                                    <input type="password" value="********************************" readOnly className="flex-grow px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-mono" />
                                    <button className="px-4 bg-zinc-100 rounded-xl text-xs font-bold text-primary">Reveal</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
