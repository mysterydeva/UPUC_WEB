"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, ShoppingCart, Minus, Plus, Trash2, Zap, Barcode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { getPOSProducts, processPOSCheckout } from "@/app/actions/pos-actions";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function POSPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (businessId) getPOSProducts(businessId).then(setProducts);
    }, [businessId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement && e.target !== searchInputRef.current) return;
            if (e.key === "Enter" && searchQuery.length > 3) {
                const matchedProduct = products.find(p => p.barcode === searchQuery);
                if (matchedProduct) {
                    addToCart(matchedProduct);
                    setSearchQuery("");
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [searchQuery, products]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert("Not enough stock!");
                    return prev;
                }
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.product.id !== id));

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === id) {
                const newQty = Math.max(1, Math.min(item.quantity + delta, item.product.stock));
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const handleCheckout = async () => {
        if (!businessId || cart.length === 0) return;
        setIsCheckingOut(true);
        const res = await processPOSCheckout(businessId, cart, "Cash / Walk-in");
        if (res.success) {
            setCart([]);
            getPOSProducts(businessId).then(setProducts);
            alert(`Success! Invoice generated: ${res.invoiceId}`);
        } else alert("Checkout failed.");
        setIsCheckingOut(false);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.barcode && p.barcode.includes(searchQuery)));
    }, [products, searchQuery]);

    const subTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cart]);
    const tax = cart.reduce((acc, item) => acc + ((item.product.price * item.quantity) * (item.product.taxRate / 100)), 0);
    const total = subTotal + tax;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6">
            <div className="flex-shrink-0">
                <PageHeader title="Point of Sale" description="Hardware-accelerated barcode scanning & checkout" icon={<Zap size={24} />} iconBgColor="bg-orange-500/10" iconColor="text-orange-600" />
            </div>

            <div className="flex flex-1 gap-8 min-h-0">
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <input ref={searchInputRef} type="text" placeholder="Connect physical barcode scanner or search manually..." className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/10 premium-shadow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                                <Barcode className="inline-block mr-1" size={14} /> Scanner Active
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2 custom-scrollbar">
                        {filteredProducts.map((product) => (
                            <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} key={product.id} onClick={() => addToCart(product)} className="bg-white p-6 rounded-[2rem] border border-zinc-100 premium-shadow text-left group transition-all hover:border-orange-500/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="px-3 py-1 bg-zinc-50 text-zinc-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-zinc-100">{product.category}</div>
                                    <span className="text-zinc-300 group-hover:text-orange-500 transition-colors"><Plus size={18} /></span>
                                </div>
                                <h4 className="text-lg font-bold text-primary mb-1">{product.name}</h4>
                                <p className="text-sm text-text-secondary mb-4">Stock: <span className="font-bold">{product.stock} units</span></p>
                                <div className="text-xl font-black text-primary">₹{product.price.toLocaleString()}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="w-96 bg-zinc-900 rounded-[2.5rem] flex flex-col premium-shadow overflow-hidden text-white">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingCart size={20} className="text-orange-500" /> Current Order</h3>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">{cart.length} items</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={item.product.id} className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="font-bold text-zinc-200">{item.product.name}</div>
                                        <div className="text-xs text-zinc-500">₹{item.product.price.toLocaleString()} x {item.quantity}</div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10"><Minus size={12} /></button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center hover:bg-white/10"><Plus size={12} /></button>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                                        <button onClick={() => removeFromCart(item.product.id)} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="p-8 bg-black/20 border-t border-white/5 space-y-4">
                        <div className="flex justify-between text-zinc-400 text-sm font-medium"><span>Subtotal</span><span>₹{subTotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-zinc-400 text-sm font-medium"><span>GST</span><span>₹{tax.toLocaleString()}</span></div>
                        <div className="flex justify-between text-xl font-bold pt-2"><span>Total</span><span className="text-orange-500">₹{total.toLocaleString()}</span></div>
                        <button disabled={cart.length === 0 || isCheckingOut} onClick={handleCheckout} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                            {isCheckingOut ? "Processing..." : <><Zap size={18} /> Complete Checkout</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
