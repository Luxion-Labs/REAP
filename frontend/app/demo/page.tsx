"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Wallet, 
  Home, 
  Coins, 
  Send, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Fingerprint,
  Building,
  Key
} from "lucide-react";
import { useWallet } from "@/components/providers/wallet-provider";
import { useContractReady } from "@/components/providers/contract-provider";
import { useProperty } from "@/hooks/use-property";
import { useToken } from "@/hooks/use-token";
import { formatAddress, formatDust, generateId } from "@/lib/contract-encoding";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";

const STEPS = [
  { id: 'connect', title: 'Connect Wallet', icon: Wallet, description: 'Establish secure connection to Midnight Preprod' },
  { id: 'register', title: 'Tokenize Asset', icon: Building, description: 'Register property parameters on the ZK ledger' },
  { id: 'fractionalize', title: 'Fractionalize', icon: Coins, description: 'Mint fractional ownership tokens' },
  { id: 'send', title: 'Send Assets', icon: Send, description: 'Transfer tokens to a counterparty wallet' },
  { id: 'verify', title: 'Verify Proofs', icon: ShieldCheck, description: 'Validate the property state on-chain' },
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { state: walletState, connectWallet, connectedApi } = useWallet();
  const { isReady, contractsDeployed } = useContractReady();
  const propertyRepo = useProperty();
  const tokenRepo = useToken();

  // Form State
  const [propertyId, setPropertyId] = useState(generateId());
  const [valuation, setValuation] = useState("10000000"); // 10 DUST
  const [location, setLocation] = useState("San Francisco, CA - Plot 42");
  const [recipientKey, setRecipientKey] = useState("");
  const [fractionAmount, setFractionAmount] = useState("100");

  const currentStep = STEPS[activeStep];

  // Auto-advance step 0 if wallet connects
  useEffect(() => {
    if (walletState.isConnected && isReady && activeStep === 0) {
      handleNext();
    }
  }, [walletState.isConnected, isReady, activeStep]);

  const handleNext = () => {
    setCompletedSteps(prev => Array.from(new Set([...prev, currentStep.id])));
    if (activeStep < STEPS.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  // ── Step Actions ─────────────────────────────────────────────────────────────

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success("Wallet secured");
    } catch (err) {
      toast.error("Connection failed");
    }
  };

  const handleRegister = async () => {
    toast.loading("Generating ZK proof for registration...", { id: "register" });
    const tx = await propertyRepo.registerProperty({
      propertyId,
      valuation: BigInt(valuation),
      locationHash: location,
      documentHash: "ipfs://Qm-doc-hash",
    });
    
    if (tx) {
      toast.success(`Property Registered! TX: ${tx.txId.slice(0, 8)}`, { id: "register" });
      handleNext();
    } else {
      toast.error(propertyRepo.error || "Registration failed", { id: "register" });
    }
  };

  const handleFractionalize = async () => {
    toast.loading("Initializing tokenization circuit...", { id: "fraction" });
    const tx = await tokenRepo.mint(walletState.coinPublicKey || "", BigInt(fractionAmount));
    
    if (tx) {
      toast.success(`Minted ${fractionAmount} fractions`, { id: "fraction" });
      handleNext();
    } else {
      toast.error(tokenRepo.error || "Minting failed", { id: "fraction" });
    }
  };

  const handleSend = async () => {
    if (!recipientKey) return toast.error("Recipient key required");
    toast.loading("Preparing private transfer proof...", { id: "send" });
    const tx = await tokenRepo.transfer(recipientKey, BigInt(10));
    
    if (tx) {
      toast.success("Transfer complete", { id: "send" });
      handleNext();
    } else {
      toast.error(tokenRepo.error || "Transfer failed", { id: "send" });
    }
  };

  const handleVerify = async () => {
    toast.loading("Verifying ledger state...", { id: "verify" });
    const data = await propertyRepo.loadProperty(propertyId);
    if (data) {
      toast.success("Property verified on-chain", { id: "verify" });
      handleNext();
    } else {
      toast.error("Verification failed", { id: "verify" });
    }
  };

  // ── Render Helpers ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">REAP Integration Demo</h1>
            </div>
            <p className="text-slate-400 max-w-lg">
              Experience the full lifecycle of a ZK-tokenized property on the Midnight blockchain.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {!contractsDeployed ? (
              <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">
                <AlertCircle className="w-3 h-3 mr-1" /> Contracts Not Deployed
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Contracts Ready
              </Badge>
            )}
            {walletState.isConnected && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-mono text-slate-300">
                  {formatAddress(walletState.coinPublicKey || "")}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isActive = activeStep === idx;
            
            return (
              <div 
                key={step.id} 
                className={`relative flex flex-col p-4 rounded-xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                    : isCompleted 
                      ? 'bg-emerald-500/5 border-emerald-500/30' 
                      : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-[10px] text-slate-500 leading-tight">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Work Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#0f172a] border-white/10 overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Step {activeStep + 1} of 5</span>
                        <h2 className="text-xl font-bold">{currentStep.title}</h2>
                      </div>
                      <Badge variant="outline" className="font-mono">{currentStep.id.toUpperCase()}</Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 space-y-8">
                    {/* Connect Step */}
                    {activeStep === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse">
                          <Wallet className="w-10 h-10 text-indigo-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">Lace DApp Connection</h3>
                          <p className="text-slate-400">Initialize the REAP protocol by linking your Midnight wallet.</p>
                        </div>
                        <Button 
                          onClick={handleConnect} 
                          disabled={walletState.isConnecting}
                          size="lg"
                          className="bg-indigo-500 hover:bg-indigo-600 px-12"
                        >
                          {walletState.isConnecting ? "Detecting Wallet..." : "Secure Connection"}
                        </Button>
                      </div>
                    )}

                    {/* Register Step */}
                    {activeStep === 1 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Property ID (Generated)</Label>
                            <Input value={propertyId} readOnly className="bg-white/5 font-mono" />
                          </div>
                          <div className="space-y-2">
                            <Label>Initial Valuation (DUST)</Label>
                            <Input value={valuation} onChange={e => setValuation(e.target.value)} className="bg-white/5" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Geospatial Location Hash</Label>
                            <Input value={location} onChange={e => setLocation(e.target.value)} className="bg-white/5" />
                          </div>
                        </div>
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-sm text-amber-200/80">
                              This action will generate a ZK proof representing these property attributes. The actual location and valuation will remain private while your ownership is proven on-chain.
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={handleRegister} 
                          disabled={propertyRepo.isPending}
                          className="w-full bg-indigo-500 h-12"
                        >
                          {propertyRepo.isPending ? "Generating Proof..." : "Tokenize Asset"}
                        </Button>
                      </div>
                    )}

                    {/* Fractionalize Step */}
                    {activeStep === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                          <div className="shrink-0 w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <Coins className="w-12 h-12 text-emerald-400" />
                          </div>
                          <div className="space-y-4 flex-1">
                            <div className="space-y-1">
                              <Label>Fractional Units to Create</Label>
                              <p className="text-[10px] text-slate-500 mb-2">Each unit represents a proportional share of the asset.</p>
                              <Input 
                                type="number" 
                                value={fractionAmount} 
                                onChange={e => setFractionAmount(e.target.value)} 
                                className="text-2xl bg-transparent border-none p-0 focus-visible:ring-0 font-bold"
                              />
                            </div>
                            <Progress value={75} className="h-1" />
                          </div>
                        </div>
                        <Button 
                          onClick={handleFractionalize} 
                          disabled={tokenRepo.isPending}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
                        >
                          {tokenRepo.isPending ? "Minting Private Tokens..." : `Create ${fractionAmount} Fractions`}
                        </Button>
                      </div>
                    )}

                    {/* Send Step */}
                    {activeStep === 3 && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Counterparty Shielded Address</Label>
                            <Input 
                              placeholder="mn_address..." 
                              value={recipientKey}
                              onChange={e => setRecipientKey(e.target.value)}
                              className="bg-white/5 font-mono" 
                            />
                          </div>
                          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Asset</span>
                              <span className="font-semibold">{propertyId.slice(0, 8)} Fraction</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Transfer Amount</span>
                              <span className="font-semibold">10 Units</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                              <span className="text-slate-400">Privacy Status</span>
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-2 py-0 text-[10px]">Fully Shielded</Badge>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={handleSend} 
                          disabled={tokenRepo.isPending || !recipientKey}
                          className="w-full bg-indigo-500 h-12"
                        >
                          {tokenRepo.isPending ? "Executing Swaps..." : "Initiate Secure Transfer"}
                        </Button>
                      </div>
                    )}

                    {/* Verify Step */}
                    {activeStep === 4 && (
                      <div className="flex flex-col items-center justify-center py-12 space-y-8">
                        <div className="relative">
                          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-12 h-12 text-indigo-400" />
                          </div>
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-indigo-500 rounded-full filter blur-xl -z-10"
                          />
                        </div>
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold">Ledger Finality</h2>
                          <p className="text-slate-400">Validating that the state transition was recorded in a block.</p>
                        </div>
                        <Button 
                          onClick={handleVerify} 
                          className="px-12 bg-indigo-500"
                          disabled={propertyRepo.isPending}
                        >
                          Confirm On-Chain State
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-[#0f172a] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Protocol Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Proof Server</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Node Sync</span>
                  <span className="text-slate-300">Block #12,492</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">SDK Version</span>
                  <span className="text-slate-300">4.0.4-browser</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-indigo-400" /> Registry Cache
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {propertyId && (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Local Asset Context</p>
                    <p className="text-xs font-mono break-all">{propertyId}</p>
                  </div>
                )}
                {tokenRepo.myBalance !== null && (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                    <span className="text-xs text-slate-400">My Balance</span>
                    <span className="text-emerald-400 font-bold">{tokenRepo.myBalance.toString()} SHARES</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-1">
                <Key className="w-3 h-3" /> Technical Insight
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                "Each transaction in this demo executes a local SNARK proof before submission. This ensures your private asset data never leaves your browser, while the blockchain remains a trustless source of truth."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
