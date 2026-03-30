"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    User,
    Building,
    Shield,
    Receipt,
    Megaphone,
    Save,
    CheckCircle2,
    ChevronRight,
    Globe,
    Smartphone,
    Palette,
    Plus
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const sections = [
        { id: "profile", label: "Account & Preferences", icon: <User size={18} /> },
        { id: "business", label: "Business Profile", icon: <Building size={18} /> },
        { id: "billing", label: "Billing & Invoicing", icon: <Receipt size={18} /> },
        { id: "security", label: "Security & Sync", icon: <Shield size={18} /> },
        { id: "marketing", label: "Growth & CRM", icon: <Megaphone size={18} /> },
    ];

    const Toggle = ({ label, description, defaultChecked = false }: any) => {
        const [checked, setChecked] = useState(defaultChecked);
        return (
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100 cursor-pointer hover:bg-zinc-100/50 transition-all" onClick={() => setChecked(!checked)}>
                <div>
                    <p className="text-sm font-bold text-primary">{label}</p>
                    {description && <p className="text-xs text-text-secondary">{description}</p>}
                </div>
                <div className={cn("w-11 h-6 rounded-full relative p-1 transition-colors", checked ? "bg-emerald-500" : "bg-zinc-200")}>
                    <motion.div
                        animate={{ x: checked ? 20 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                </div>
            </div>
        );
    };

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
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
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
                    <AnimatePresence mode="wait">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
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
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Phone / Registration</label>
                                            <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/10" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-6">
                                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                        <Globe size={20} className="text-zinc-400" /> Localization Preferences
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">App Language</label>
                                            <select className="w-full max-w-sm px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-accent/10">
                                                <option>English</option>
                                                <option>Hindi (हिंदी)</option>
                                                <option>Hinglish</option>
                                                <option>Gujarati (ગુજરાતી)</option>
                                                <option>Tamil (தமிழ்)</option>
                                            </select>
                                        </div>
                                        <Toggle label="Quick Setup Onboarding Guide" description="Show tooltips and guides for new modules" defaultChecked={true} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Business Tab */}
                        {activeTab === "business" && (
                            <motion.div
                                key="business"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                            <Building size={20} className="text-zinc-400" /> Multi-Business Setup
                                        </h3>
                                        <button className="h-9 px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-primary flex items-center gap-2 transition-colors">
                                            <Plus size={14} /> Add Business
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {[1, 2].map((idx) => (
                                            <div key={idx} className={cn("p-5 rounded-2xl border transition-all flex items-center justify-between", idx === 1 ? "bg-emerald-50/50 border-emerald-500/20" : "bg-zinc-50 border-zinc-100")}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-sm font-black">
                                                        {idx === 1 ? "UF" : "BS"}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-primary">{idx === 1 ? "UPUC Fenestration Systems Pvt Ltd" : "BuildSafe Hardware Supply"}</h4>
                                                        <p className="text-xs text-text-secondary">GSTIN: 29AAAAA0000A1Z{idx}</p>
                                                    </div>
                                                </div>
                                                {idx === 1 && (
                                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === "billing" && (
                            <motion.div
                                key="billing"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-6">
                                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                        <Palette size={20} className="text-zinc-400" /> Invoice Customization
                                    </h3>

                                    <div className="grid lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Default Invoice Theme</label>
                                            <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-accent/10">
                                                <option>Luxury (A4)</option>
                                                <option>Modern (A4)</option>
                                                <option>Stylish Blueprint (A4)</option>
                                                <option>POS Thermal (3 Inch)</option>
                                                <option>Compact (A5)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Total Amount Round Off</label>
                                            <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-accent/10">
                                                <option>Nearest Rupee / Auto</option>
                                                <option>Do not round off (2 Decimals)</option>
                                                <option>Do not round off (4 Decimals)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-zinc-50">
                                        <Toggle label="UPI QR Code on Invoice" description="Print dynamic payment QR for exact invoice amounts" defaultChecked={true} />
                                        <Toggle label="Remove ERP Branding" description="Enterprise feature to hide 'Generated by UPUC ERP' watermark" defaultChecked={false} />
                                        <Toggle label="Item Images on Invoices" description="Include thumbnail photos of inventory items next to rows" defaultChecked={true} />
                                        <Toggle label="Custom Fields Display" description="Show PO Number, Vehicle No., and extra data" defaultChecked={true} />
                                        <Toggle label="Default Terms & Conditions" description="Automatically append standard warranty and legal T&Cs to all outbound PDFs" defaultChecked={true} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-6"
                            >
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <Smartphone size={20} className="text-zinc-400" /> Access & Data Sync
                                </h3>
                                <div className="space-y-4">
                                    <Toggle label="Multi-Device Login Sync" description="Allow real-time data streaming across Desktop, iOS, and Android seamlessly" defaultChecked={true} />
                                    <Toggle label="Automated Cloud Backup" description="Nightly backup of entire ERP SQLite to secure AWS bucket" defaultChecked={true} />
                                    <button className="w-full py-4 px-6 border border-zinc-100 rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-all">
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-primary">Change Root Password</p>
                                            <p className="text-xs text-text-secondary">Last changed 3 months ago</p>
                                        </div>
                                        <ChevronRight size={18} className="text-zinc-300" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Marketing Tab */}
                        {activeTab === "marketing" && (
                            <motion.div
                                key="marketing"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 premium-shadow space-y-6"
                            >
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <Megaphone size={20} className="text-zinc-400" /> Growth & CRM Features
                                </h3>
                                <div className="space-y-4">
                                    <Toggle label="Digital Business Cards" description="Auto-generate shareable vCards for all your employees" defaultChecked={true} />
                                    <Toggle label="Personalized Greetings" description="Send automated WhatsApp messages for client Birthdays & Anniversaries" defaultChecked={false} />
                                    <Toggle label="Loyalty & Rewards Points" description="Calculate points (e.g. 1% cashback value) on fully paid Sales Invoices" defaultChecked={true} />
                                    <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                                        <p className="text-lg font-bold text-indigo-900">Digital Storefront Link</p>
                                        <p className="text-sm text-indigo-700/80 mt-1 mb-4">Share your product catalogue with clients instantly.</p>
                                        <div className="inline-flex px-4 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-mono font-bold text-indigo-600">
                                            https://erp.upuc.com/store/UF-2026
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
