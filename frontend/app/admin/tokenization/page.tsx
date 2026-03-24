"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, ArrowRight, Layers, Coins, TrendingUp, CheckCircle2, Shield, Activity, Loader2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function TokenizationPage() {
  const [step, setStep] = useState(1);
  const [isTokenizing, setIsTokenizing] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropId, setSelectedPropId] = useState("");
  const [supply, setSupply] = useState("");
  const [price, setPrice] = useState("");

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

  const selectedProp = useMemo(() => properties.find(p => p.id === selectedPropId), [properties, selectedPropId]);
  const totalValuation = useMemo(() => {
    const s = parseFloat(supply) || 0;
    const p = parseFloat(price) || 0;
    return s * p;
  }, [supply, price]);

  const handleTokenize = async () => {
    if (!selectedPropId || !supply || !price) {
      toast.error('All fields are required');
      return;
    }
    setIsTokenizing(true);
    try {
      // Simulate DApp minting transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(2);
    } catch (e) {
      toast.error('Failed to tokenize');
    } finally {
      setIsTokenizing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-blue-500" />
          Asset Tokenization Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Convert registered real estate into fractional digital ownership units on the Midnight Network. Configure token economics and deploy smart contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Mint Fractional Tokens</CardTitle>
            <CardDescription>Convert a registered property into tradable digital units on the Midnight network.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="property">Select Registered Property</Label>
                  <select 
                    id="property" 
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                  >
                    <option value="">-- Select a Property --</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${parseFloat(p.Value || p.value || 0).toLocaleString()})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supply">Total Token Supply</Label>
                    <Input id="supply" type="number" value={supply} onChange={e => setSupply(e.target.value)} placeholder="100,000" className="bg-slate-50 dark:bg-slate-900/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Initial Price per Token (USD)</Label>
                    <Input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="50.00" className="bg-slate-50 dark:bg-slate-900/50" />
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative group mt-4">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className="h-24 w-24" />
                  </div>
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Market Valuation Simulation
                  </h4>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Selected Asset:</span>
                      <span className="font-medium text-slate-200">{selectedProp ? selectedProp.name : 'None Selected'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Contract Base:</span>
                      <span className="text-blue-300 font-mono">reap_asset_v1.0.mid</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold pt-2 border-t border-white/10 mt-2">
                      <span>Total Valuation</span>
                      <span className="text-blue-400">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white gap-3 rounded-xl shadow-lg shadow-blue-500/20 mt-6" 
                  onClick={handleTokenize}
                  disabled={isTokenizing || !selectedPropId}
                >
                  {isTokenizing ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Generating proofs & Deploying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-6 w-6" />
                      Tokenize Asset on-chain
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                  <PieChart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tokenization Successful</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                  {parseFloat(supply).toLocaleString()} fractional units have been minted for <span className="font-bold text-slate-700 dark:text-slate-300">{selectedProp?.name || 'Asset'}</span>.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => { setStep(1); setSupply(""); setPrice(""); setSelectedPropId(""); }}>
                  Tokenize Another Asset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Tokenized Assets */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Tokenized Properties</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">Commercial Hub {i}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ticker: CH{i}-REAP</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">$2.5M</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Valuation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Coins className="h-3 w-3" />
                      50,000 Units
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-purple-600 dark:text-purple-400 pl-2">
                       View Contract <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
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
