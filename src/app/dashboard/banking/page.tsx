"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Landmark,
    Plus,
    CreditCard,
    ArrowDownRight,
    ArrowUpRight,
    WalletCards,
    Search,
    Building,
    RefreshCcw
} from "lucide-react";
import { getBankAccounts, getTransactions, addBankAccount, addTransaction } from "@/app/actions/banking-actions";

export default function BankingPage() {
    const { data: session } = useSession();
    const businessId = session?.user?.businessId;

    const [accounts, setAccounts] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAddAccount, setShowAddAccount] = useState(false);
    const [showAddTransaction, setShowAddTransaction] = useState(false);

    const loadData = async () => {
        if (!businessId) return;
        setLoading(true);
        const [accs, txns] = await Promise.all([
            getBankAccounts(businessId),
            getTransactions(businessId)
        ]);
        setAccounts(accs);
        setTransactions(txns);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [businessId]);

    const handleAddAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!businessId) return;
        const formData = new FormData(e.currentTarget);
        await addBankAccount({
            name: formData.get("name") as string,
            accountNo: formData.get("accountNo") as string,
            ifscCode: formData.get("ifscCode") as string,
            branchName: formData.get("branchName") as string,
            openingBalance: parseFloat(formData.get("balance") as string) || 0,
            businessId
        });
        setShowAddAccount(false);
        loadData();
    };

    const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!businessId) return;
        const formData = new FormData(e.currentTarget);
        await addTransaction({
            bankAccountId: formData.get("bankAccountId") as string,
            type: formData.get("type") as string,
            amount: parseFloat(formData.get("amount") as string) || 0,
            reference: formData.get("reference") as string,
            businessId
        });
        setShowAddTransaction(false);
        loadData();
    };

    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Landmark size={24} className="text-accent" />
                        Banking & Ledgers
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Manage your bank accounts, payments, and view your digital ledgers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowAddTransaction(true)} className="h-10 px-4 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 transition-all">
                        <RefreshCcw size={16} /> Record Transaction
                    </button>
                    <button onClick={() => setShowAddAccount(true)} className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-bold flex items-center gap-2 hover:bg-primary-light transition-all premium-shadow group">
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Add Bank Account
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Consolidated Balance Widget */}
                <div className="col-span-1 bg-primary text-white p-6 rounded-[2rem] premium-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                <WalletCards size={20} className="text-accent" />
                            </div>
                            <h3 className="font-bold text-white/90">Total Liquid Cash</h3>
                        </div>
                        <div>
                            <p className="text-4xl font-black">₹{totalBalance.toLocaleString()}</p>
                            <p className="text-sm text-white/60 mt-2">Across {accounts.length} linked accounts</p>
                        </div>
                    </div>
                </div>

                {/* Quick Add Form or Accounts List */}
                <div className="col-span-2 grid sm:grid-cols-2 gap-4">
                    {accounts.map(acc => (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={acc.id} className="p-5 rounded-3xl bg-white border border-zinc-100 premium-shadow flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-primary">
                                        <Building size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary text-sm">{acc.name}</p>
                                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{acc.accountNo}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest pl-1 mb-1">Available Balance</p>
                                <p className="text-2xl font-black text-primary">₹{acc.balance.toLocaleString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Transactions Ledger */}
            <div className="bg-white rounded-[2rem] border border-zinc-100 premium-shadow overflow-hidden">
                <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
                    <h3 className="font-bold text-primary text-lg">Recent Transactions</h3>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder="Search UTR, amount..." className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 w-64" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50">
                            <tr>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Date</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Description / UTR</th>
                                <th className="text-left text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Account</th>
                                <th className="text-right text-xs font-bold text-zinc-500 uppercase tracking-wider py-4 px-6">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-zinc-400">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <CreditCard size={32} className="text-zinc-300" />
                                            <p className="text-sm">No transactions found in ledger.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.map((t, idx) => (
                                <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="py-4 px-6 text-sm text-text-secondary">
                                        {new Date(t.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", t.type === 'Payment In' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
                                                {t.type === 'Payment In' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-primary">{t.type}</p>
                                                <p className="text-[10px] text-zinc-400 font-mono">Ref: {t.reference || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-primary">
                                        {t.bankAccount?.name || 'Unknown'}
                                    </td>
                                    <td className={cn("py-4 px-6 text-sm font-black text-right", t.type === 'Payment In' ? 'text-emerald-600' : 'text-red-500')}>
                                        {t.type === 'Payment In' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showAddAccount && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md premium-shadow">
                        <h3 className="text-xl font-bold text-primary mb-6">Add Bank Account</h3>
                        <form onSubmit={handleAddAccount} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Bank Name</label>
                                <input name="name" required placeholder="e.g. HDFC Current A/c" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Account No</label>
                                    <input name="accountNo" placeholder="1234567890" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">IFSC Code</label>
                                    <input name="ifscCode" placeholder="HDFC0001234" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Opening Balance (₹)</label>
                                <input name="balance" type="number" required defaultValue="0" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAddAccount(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all">
                                    Add Account
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {showAddTransaction && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md premium-shadow">
                        <h3 className="text-xl font-bold text-primary mb-6">Record Transaction</h3>
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Target Bank Account</label>
                                <select name="bankAccountId" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
                                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (Bal: ₹{acc.balance})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Type</label>
                                    <select name="type" required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
                                        <option>Payment In</option>
                                        <option>Payment Out</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Amount (₹)</label>
                                    <input name="amount" type="number" required placeholder="10000" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Reference (UTR/Cheque)</label>
                                <input name="reference" placeholder="e.g. UTR12345678" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAddTransaction(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-orange-600 transition-all">
                                    Save Transaction
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
