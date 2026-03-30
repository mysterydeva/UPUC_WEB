import { prisma } from "@/lib/prisma";
import { ShoppingBag, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

export default async function BusinessStore({ params }: { params: { businessId: string } }) {
    let business = null;
    try {
        business = await prisma.business.findUnique({
            where: { id: params.businessId },
            include: { inventory: true }
        });
    } catch (e) {
        console.error("Storefront data fetch error:", e);
    }

    if (!business) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-10">
                <ShoppingBag size={64} className="text-zinc-200 mb-6" />
                <h1 className="text-2xl font-black text-primary mb-2">Store Not Available</h1>
                <p className="text-zinc-400 text-sm">The requested business store could not be found or is currently offline.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            {/* Store Header */}
            <header className="bg-white border-b border-zinc-100 py-10 px-6 md:px-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white text-3xl font-black">
                            {business.name.substring(0, 1)}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-primary tracking-tighter">{business.name}</h1>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                                <span className="px-2 py-0.5 bg-zinc-100 rounded text-[10px] font-black uppercase">Verified Merchant</span>
                                <span>•</span>
                                <span>{business.inventory.length} Products</span>
                            </div>
                        </div>
                    </div>
                    <button className="h-14 px-8 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition-all premium-shadow flex items-center gap-3">
                        <ShoppingBag size={20} /> Request a Quote
                    </button>
                </div>
            </header>

            {/* Product Grid */}
            <main className="flex-grow py-16 px-6 md:px-20 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {business.inventory.map((item: any) => (
                        <div key={item.id} className="bg-white rounded-[2.5rem] p-6 border border-zinc-100 premium-shadow hover:scale-[1.02] transition-all group cursor-pointer">
                            <div className="aspect-square bg-zinc-100 rounded-[2rem] mb-6 flex items-center justify-center text-zinc-300 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                <ShoppingBag size={48} strokeWidth={1} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-primary leading-tight">{item.name}</h3>
                                    <div className="flex items-center text-emerald-600 gap-1 text-xs font-black">
                                        <Star size={12} fill="currentColor" /> 4.9
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{item.category}</div>
                                    <div className="text-xl font-black text-primary tracking-tighter">In Stock</div>
                                </div>
                                <button className="w-full py-3 rounded-xl bg-zinc-50 group-hover:bg-primary group-hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2">
                                    View Details <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 text-center text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] border-t border-zinc-100 mt-20">
                Powered by UPUC ERP Storefront
            </footer>
        </div>
    );
}
