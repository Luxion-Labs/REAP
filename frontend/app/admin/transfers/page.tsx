"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Lock, Shield, EyeOff, Send, Loader2, CheckCircle2, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function TransfersPage() {
  const [step, setStep] = useState(1);
  const [isTransferring, setIsTransferring] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const fetchProperties = async () => {
    try {
      const res = await apiClient.getProperties();
      if (res.success && Array.isArray(res.data)) {
        setProperties(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleTransfer = async () => {
    if (!selectedAsset || !recipient || !amount) {
      toast.error('All fields are required');
      return;
    }
    setIsTransferring(true);
    try {
      // Simulate DApp ZK Shielded Transfer transaction
      await new Promise(resolve => setTimeout(resolve, 2500));
      setStep(2);
    } catch (e) {
      toast.error('Transaction failed');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100 flex items-center gap-3">
          <ArrowRightLeft className="h-8 w-8 text-emerald-500" />
          Shielded Value Transfer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Securely transfer fractional ownership using Zero-Knowledge proofs. Both the transaction amount and recipient identity remain private on the public ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Initiate Shielded Transfer</CardTitle>
            <CardDescription>Send fractional tokens securely where transaction values remain private on-chain.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="token">Select Asset to Transfer</Label>
                  <select 
                    id="token" 
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                  >
                    <option value="">-- Choose Tokenized Asset --</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Tkr: {p.name.substring(0,3).toUpperCase()}-REAP)</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Shielded Address</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} className="pl-9" placeholder="mn_shield..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Units)</Label>
                  <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="50" />
                </div>

                <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative group mt-4">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <EyeOff className="h-24 w-24" />
                  </div>
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    Transaction Privacy Guard
                  </h4>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Ledger Protocol:</span>
                      <span className="font-mono text-emerald-300">Midnight ZK-Rollup</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Shielded Payload:</span>
                      <span className="text-slate-200 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap ml-4">
                        {amount && recipient ? `zkp_hash_enc_${btoa(amount + recipient).slice(0,16)}...` : 'Waiting for input...'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full py-6 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-3 rounded-xl shadow-lg shadow-emerald-500/20 mt-6" 
                  onClick={handleTransfer}
                  disabled={isTransferring || !selectedAsset || !recipient || !amount}
                >
                  {isTransferring ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Generating ZK Proof & Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-6 w-6" /> 
                      Execute Shielded Transfer
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center animate-in zoom-in duration-300">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Transfer Executed</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                  The transaction was successfully verified via Zero-Knowledge proof and anchor to the public ledger without revealing sensitive data.
                </p>
                <div className="mt-4 p-4 w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 flex flex-col gap-2 text-left">
                  <span className="flex justify-between"><span>Tx Type:</span> <span className="text-emerald-500 font-semibold">Shielded ZK-SNARK</span></span>
                  <span className="flex justify-between"><span>Amount:</span> <span>Hidden on-chain</span></span>
                  <span className="flex justify-between"><span>Tx Hash:</span> <span className="text-blue-500">0xdb4a...9f2c</span></span>
                </div>
                <Button className="mt-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 w-full" onClick={() => { setStep(1); setRecipient(""); setAmount(""); setSelectedAsset(""); }}>
                  Initiate New Transfer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transfers (Shielded) */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Shielded History</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 dark:via-white/5 dark:to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      <ArrowRightLeft className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">LV{i}-REAP</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">Sent</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">To: ***********</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[10px] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <Shield className="h-3 w-3" /> Shielded
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{i * 2}h ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
