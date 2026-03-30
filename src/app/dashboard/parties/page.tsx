"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, FileText, Send, Phone, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { getParties, createParty } from "@/app/actions/party-actions";

export default function PartiesPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [parties, setParties] = useState<any[]>([]);
    const [showAdd, setShowAdd] = useState(false);

    const loadData = async () => {
        if (!businessId) return;
        const data = await getParties(businessId);
        setParties(data);
    };

    useEffect(() => { loadData(); }, [businessId]);

    const handleDownloadLedger = (party: any) => {
        // Uses standard browser print to generate PDF statement cleanly using our Phase 10 @media print CSS
        alert("Preparing Ledger Statement for " + party.name);
        window.print();
    };

    const handleWhatsAppShare = (party: any) => {
        const message = encodeURIComponent(`Hello ${party.name},\n\nPlease find your updated ledger statement for the current financial year. Your outstanding balance is pending review.\n\nThank you,\nUPUC Management`);
        window.open(`https://wa.me/91${party.mobile}?text=${message}`, "_blank");
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!businessId) return;
        const formData = new FormData(e.currentTarget);
        await createParty({
            name: formData.get("name") as string,
            mobile: formData.get("mobile") as string,
            gstin: formData.get("gstin") as string,
            businessId
        });
        setShowAdd(false);
        loadData();
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Hide header when printing the ledger statement */}
            <div className="print:hidden">
                <PageHeader title="Parties & Contacts" description="Manage customers, suppliers, and generate chronological Ledger Statements." icon={<Users size={24} />} iconBgColor="bg-indigo-500/10" iconColor="text-indigo-500">
                    <button onClick={() => setShowAdd(true)} className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary-light transition-all premium-shadow font-bold">
                        Add Party
                    </button>
                </PageHeader>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 print:grid-cols-1">
                {parties.map(party => (
                    <div key={party.id} className="bg-white rounded-[2rem] p-6 border border-zinc-100 premium-shadow break-inside-avoid">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-primary">{party.name}</h3>
                                <p className="text-xs text-zinc-500 font-mono mt-1">GSTIN: {party.gstin || "Unregistered"}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="p-2 bg-zinc-50 rounded-xl text-zinc-400"><Phone size={14} /></span>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Contact</span>
                                <span className="font-bold">+91 {party.mobile || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Total Vouchers</span>
                                <span className="font-bold">{party.vouchers?.length || 0}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 print:hidden">
                            <button onClick={() => handleDownloadLedger(party)} className="flex justify-center items-center gap-2 py-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold transition-colors">
                                <FileText size={14} /> PDF Ledger
                            </button>
                            <button onClick={() => handleWhatsAppShare(party)} className="flex justify-center items-center gap-2 py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl text-xs font-bold transition-colors">
                                <MessageCircle size={14} /> WhatsApp
                            </button>
                        </div>
                    </div>
                ))}

                {parties.length === 0 && !showAdd && (
                    <div className="col-span-full py-20 text-center text-zinc-400 font-bold italic border-2 border-dashed border-zinc-200 rounded-[2rem]">
                        No parties found. Add your first customer or supplier.
                    </div>
                )}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md premium-shadow">
                        <h3 className="text-xl font-bold text-primary mb-6">New Party Profile</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div><label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Business Name</label><input name="name" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" /></div>
                            <div><label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Mobile No (10-digit)</label><input name="mobile" required type="tel" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" /></div>
                            <div><label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">GSTIN (Optional)</label><input name="gstin" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" /></div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700">Save Party</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
