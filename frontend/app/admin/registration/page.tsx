"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Link as LinkIcon, UploadCloud, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', owner: '' });

  const fetchProperties = async () => {
    try {
      const res = await apiClient.getProperties();
      if (res.success && Array.isArray(res.data)) {
        setProperties(res.data.slice(0, 5)); // Keep only recent 5
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleRegister = async () => {
    if (!formData.title || !formData.owner) {
      toast.error('Title and owner are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulate hashing and ZKP
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const res = await apiClient.addProperty({
        name: formData.title,
        description: `Owned by ${formData.owner}`,
        type: 'RESIDENTIAL', // Default mock type
        location: 'Virtual Ledger',
        value: 1000000,
        shares: 1000,
        documentId: `doc_${Date.now()}`
      });

      if (res.success) {
        setStep(2);
        fetchProperties();
      } else {
        toast.error('Failed to register');
      }
    } catch (e) {
       toast.error('Error connecting to backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Property Registration</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Ownership documents are securely anchored on-chain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Form */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Anchor Property Documents</CardTitle>
            <CardDescription>Upload deeds and ownership proofs to immutably anchor them on the Midnight Network.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData(f => ({...f, title: e.target.value}))} placeholder="e.g. 123 Blockchain Ave" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Legal Owner Name</Label>
                  <Input id="owner" value={formData.owner} onChange={e => setFormData(f => ({...f, owner: e.target.value}))} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Ownership Documents</Label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <UploadCloud className="h-8 w-8 text-slate-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleRegister}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Anchoring on-chain..." : "Register Property"}
                </Button>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registration Successful</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                  The property documents have been securely anchored. An immutable proof is now on-chain.
                </p>
                <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg break-all text-xs font-mono text-slate-600 dark:text-slate-400">
                  Tx Hash: 0x9f4a...8c2b7d
                </div>
                <Button variant="outline" className="mt-6" onClick={() => setStep(1)}>
                  Register Another
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Records */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Registrations</h3>
          <div className="space-y-4">
            {properties.map((prop, i) => (
              <Card key={prop.id || i} className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{prop.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Anchored {new Date(prop.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            {properties.length === 0 && (
              <div className="text-center p-4 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                No recent registrations
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
