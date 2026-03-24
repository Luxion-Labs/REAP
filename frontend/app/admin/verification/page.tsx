"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Fingerprint, FileCheck2, UserCheck, AlertTriangle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function VerificationPage() {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [minStake, setMinStake] = useState("");

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

  const selectedProp = useMemo(() => properties.find(p => p.id === selectedAsset), [properties, selectedAsset]);

  const handleVerify = async () => {
    if (!selectedAsset || !minStake) {
      toast.error('All fields are required');
      return;
    }
    setIsVerifying(true);
    try {
      // Simulate DApp ZK Verification
      await new Promise(resolve => setTimeout(resolve, 2500));
      setStep(2);
    } catch(e) {
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ownership Verification</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Stake can be proven without exposing sensitive identity (Zero-Knowledge).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Verify Asset Holding</CardTitle>
            <CardDescription>Request a cryptographic proof that a user holds sufficient stake, without revealing their exact balance or identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="token">Asset Registration</Label>
                  <select 
                    id="token" 
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                  >
                    <option value="">-- Choose Tokenized Asset --</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimum">Required Minimum Stake (Units)</Label>
                  <Input id="minimum" type="number" value={minStake} onChange={e => setMinStake(e.target.value)} placeholder="1000" />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3 p-4 border rounded-lg border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                    <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">KYC Compliant Proof</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        The user provides a ZK proof that they meet the threshold criteria and have passed compliance checks, while ensuring their wallet address remains anonymous.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleVerify}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">Verifying Cryptographic Proof...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Fingerprint className="h-4 w-4" /> Verify Proof of Ownership</span>
                  )}
                </Button>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 relative">
                  <ShieldCheck className="h-10 w-10 relative z-10" />
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Proof Verified Successfully</h3>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-left w-full mt-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FileCheck2 className="h-4 w-4 text-emerald-500" /> 
                      User holds <span className="font-bold">&gt;= {minStake} units</span> of {selectedProp?.name || 'Asset'}
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FileCheck2 className="h-4 w-4 text-emerald-500" /> 
                      Compliance (KYC) status valid
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <AlertTriangle className="h-4 w-4" /> 
                      Exact balance: <span className="italic">Hidden</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <AlertTriangle className="h-4 w-4" /> 
                      Identity: <span className="italic">Anonymous</span>
                    </li>
                  </ul>
                </div>
                
                <Button variant="outline" className="mt-6 w-full" onClick={() => { setStep(1); setSelectedAsset(""); setMinStake(""); }}>
                  Verify Another User
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Verifications</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <Fingerprint className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">Anonymous Proof</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Threshold: 500 Units</p>
                      </div>
                    </div>
                    {i === 2 ? (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                        Failed
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                    Proof ID: zkp_9f2x{i}...a4{i}
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
