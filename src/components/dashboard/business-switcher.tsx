"use client";

import { useState } from "react";
import { ChevronDown, Building2, Check, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const businesses = [
    { id: "1", name: "UPVC Fabricators Main", gstin: "27AAAAA0000A1Z5" },
    { id: "2", name: "Skyline Interiors", gstin: "27BBBBB0000B1Z6" },
];

export function BusinessSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(businesses[0]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all text-left group"
            >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Building2 size={20} />
                </div>
                <div className="hidden md:block">
                    <div className="text-sm font-bold text-primary truncate max-w-[150px]">{selected.name}</div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{selected.gstin}</div>
                </div>
                <ChevronDown size={16} className={cn("text-zinc-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-zinc-100 premium-shadow z-50 overflow-hidden p-2"
                        >
                            <div className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50 mb-2">My Businesses</div>
                            {businesses.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => { setSelected(b); setIsOpen(false); }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all",
                                        selected.id === b.id ? "bg-primary/5 text-primary" : "hover:bg-zinc-50 text-text-secondary"
                                    )}
                                >
                                    <div className="text-sm font-bold">{b.name}</div>
                                    {selected.id === b.id && <Check size={16} />}
                                </button>
                            ))}
                            <div className="mt-2 pt-2 border-t border-zinc-50">
                                <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-50 hover:text-primary transition-all text-sm font-bold">
                                    <Plus size={16} /> Add New Business
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
