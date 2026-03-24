"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Plus,
  List,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Shield,
  Trash2,
  Loader2,
  Lock,
  ArrowRight,
  PieChart,
  Activity,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyRegistration } from '@/components/property-registration';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Property {
  id: string;
  title: string;
  status: 'draft' | 'registered' | 'tokenized' | 'listed';
  totalValue: number;
  totalTokens: number;
  tokensMinted: number;
  createdAt: string;
  hash?: string;
}

export default function AdminPropertiesPage() {
  const [activeTab, setActiveTab] = useState('manage');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [tokenConfig, setTokenConfig] = useState({
    propertyId: '',
    symbol: '',
    supply: 1000,
    price: 0,
    platformReserve: 10,
    liquidityPool: 20,
    publicSale: 70
  });

  const selectedProperty = useMemo(() => 
    properties.find(p => p.id === tokenConfig.propertyId),
    [tokenConfig.propertyId, properties]
  );

  const totalValuation = useMemo(() => 
    tokenConfig.supply * tokenConfig.price,
    [tokenConfig.supply, tokenConfig.price]
  );

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.getProperties();
      if (res.success && Array.isArray(res.data)) {
        const mappedProperties = res.data.map((p: any) => ({
          id: p.id,
          title: p.name,
          status: 'registered' as const, // Default for now
          totalValue: p.Value || p.value || 0,
          totalTokens: p.Shares || p.shares || 0,
          tokensMinted: p.Shares || p.shares || 0,
          createdAt: p.createdAt,
          hash: p.locationHash || 'not-anchored'
        }));
        setProperties(mappedProperties);
      }
    } catch (e) {
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyRegistered = (propertyId: string) => {
    fetchProperties();
    setActiveTab('manage');
  };

  const handleViewDetails = (property: Property) => {
    toast(`Viewing details for ${property.title}`, {
      icon: '🔍',
    });
  };

  const handleMintTokens = async () => {
    if (!tokenConfig.propertyId) return;
    
    setIsMinting(true);
    toast.loading('Generating ZKP & Minting tokens...', { id: 'mint' });
    
    // Simulate real delay
    setTimeout(() => {
      // Update local state to reflect tokenization (simulated)
      setProperties(prev => prev.map(p => 
        p.id === tokenConfig.propertyId 
          ? { 
              ...p, 
              status: 'tokenized', 
              totalTokens: tokenConfig.supply, 
              tokensMinted: tokenConfig.supply,
              totalValue: tokenConfig.supply * tokenConfig.price
            } 
          : p
      ));
      
      toast.success(`${tokenConfig.symbol} tokens minted successfully!`, { id: 'mint' });
      
      // Clear form
      setTokenConfig({
        propertyId: '',
        symbol: '',
        supply: 1000,
        price: 0,
        platformReserve: 10,
        liquidityPool: 20,
        publicSale: 70
      });
      
      setIsMinting(false);
      setActiveTab('manage'); // Switch to manage tab to see the updated status
    }, 2000);
  };

  const handleDeleteProperty = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await apiClient.deleteProperty(id);
      if (res.success) {
        toast.success('Property deleted successfully');
        fetchProperties();
      } else {
        toast.error(res.message || 'Failed to delete property');
      }
    } catch (e) {
      toast.error('An error occurred');
    }
  };

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'tokenized': return 'bg-green-100 text-green-800';
      case 'listed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPropertiesValue = properties.reduce((sum, prop) => sum + prop.totalValue, 0);
  const totalTokensMinted = properties.reduce((sum, prop) => sum + prop.tokensMinted, 0);

  return (
    <div className="w-full p-8 space-y-8 bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Property Management</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Register properties, mint tokens, and manage the BrickChain ecosystem
          </p>
        </div>
        <Button
          onClick={() => setActiveTab('register')}
          className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
        >
          <Plus className="h-4 w-4" />
          Register Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{properties.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Registered properties</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">${totalPropertiesValue.toLocaleString()}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Property portfolio value</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Tokens Minted</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalTokensMinted.toLocaleString()}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total tokens in circulation</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Active Listings</CardTitle>
            <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {properties.filter(p => p.status === 'listed').length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Properties available for trading</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-200 dark:bg-slate-700">
          <TabsTrigger value="register" className="gap-2 text-slate-900 dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <Plus className="h-4 w-4" />
            Register Property
          </TabsTrigger>
          <TabsTrigger value="tokenize" className="gap-2 text-slate-900 dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <TrendingUp className="h-4 w-4" />
            Tokenize Assets
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-2 text-slate-900 dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <List className="h-4 w-4" />
            Manage Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-6">
          <PropertyRegistration onSuccess={handlePropertyRegistered} />
        </TabsContent>        <TabsContent value="tokenize" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Tokenization Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Asset Tokenization Setup
                  </CardTitle>
                  <CardDescription>
                    Configure the digital twin and token distribution for your legal property asset.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Property Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Select Registered Asset
                      </label>
                      <select 
                        value={tokenConfig.propertyId}
                        onChange={(e) => setTokenConfig({...tokenConfig, propertyId: e.target.value})}
                        className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="">Choose a verified property...</option>
                        {properties
                          .filter(p => p.status === 'registered')
                          .map(property => (
                            <option key={property.id} value={property.id}>
                              {property.title} (Verified Hash: {property.hash?.slice(0, 10)}...)
                            </option>
                          ))}
                      </select>
                      {selectedProperty && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                        >
                          <Shield className="h-3 w-3" />
                          Legally verified asset with SHA-256 anchor is ready for tokenization.
                        </motion.div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Token Symbol / Ticker</label>
                        <input
                          type="text"
                          placeholder="e.g. DOWNTWN"
                          value={tokenConfig.symbol}
                          onChange={(e) => setTokenConfig({...tokenConfig, symbol: e.target.value.toUpperCase()})}
                          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Smart Contract Base</label>
                        <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center gap-2">
                          <Lock className="h-3 w-3 text-slate-500" />
                          reap_asset_v1.0_zkp.mid
                        </div>
                      </div>
                    </div>

                    {/* Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Total Supply (Tokens)</label>
                        <input
                          type="number"
                          value={tokenConfig.supply}
                          onChange={(e) => setTokenConfig({...tokenConfig, supply: parseInt(e.target.value) || 0})}
                          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price per Token (USD)</label>
                        <input
                          type="number"
                          value={tokenConfig.price}
                          onChange={(e) => setTokenConfig({...tokenConfig, price: parseFloat(e.target.value) || 0})}
                          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>

                    {/* Distribution Summary */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Distribution Mechanism
                      </h4>
                      <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                        <div style={{ width: `${tokenConfig.platformReserve}%` }} className="bg-blue-500" />
                        <div style={{ width: `${tokenConfig.liquidityPool}%` }} className="bg-green-500" />
                        <div style={{ width: `${tokenConfig.publicSale}%` }} className="bg-purple-500" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
                        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Platform ({tokenConfig.platformReserve}%)</div>
                        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Liquidity ({tokenConfig.liquidityPool}%)</div>
                        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Public ({tokenConfig.publicSale}%)</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Shield className="h-24 w-24" />
                      </div>
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-400" />
                        Real Implementation Simulation
                      </h4>
                      <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Trustless Anchor:</span>
                          <span className="font-mono text-blue-300">verified_proof_v1.2</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Legal Wrapper:</span>
                          <span className="text-slate-200">Reap-Holding-LLC</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-bold pt-2 border-t border-white/10">
                          <span>Total Valuation</span>
                          <span className="text-blue-400">${totalValuation.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleMintTokens}
                      disabled={isMinting || !tokenConfig.propertyId || !tokenConfig.symbol}
                      className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white gap-3 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                      {isMinting ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" />
                          Generating ZKP & Minting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-6 w-6" />
                          Initialize Tokenization
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tokenized Properties List (Restored) */}
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Tokenized Assets</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Properties successfully fractionalized on-chain.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {properties.filter(p => p.status === 'tokenized').length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">No tokenized properties yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties
                        .filter(p => p.status === 'tokenized')
                        .map(property => (
                          <div key={property.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-white">{property.title}</h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {property.totalTokens.toLocaleString()} tokens minted
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-slate-900 dark:text-white">${property.totalValue.toLocaleString()}</div>
                              <div className="text-[10px] text-blue-500 font-mono">
                                Hash: {property.hash?.slice(0, 12)}...
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Educational & Info Sidebar */}
            <div className="space-y-6">
              <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-300">
                    <Info className="h-4 w-4" />
                    How it works
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-4 text-blue-700 dark:text-blue-400 leading-relaxed">
                  <div className="space-y-2">
                    <p className="font-bold uppercase tracking-wider opacity-60">Step 1: Legal Anchor</p>
                    <p>The system verifies the SHA-256 hash of the property documents you uploaded during registration.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold uppercase tracking-wider opacity-60">Step 2: Smart Contract Deployment</p>
                    <p>A specific asset token contract is deployed. In a real-world scenario, this contract handles dividends and voting rights.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold uppercase tracking-wider opacity-60">Step 3: ZK Validation</p>
                    <p>Zero-knowledge proofs ensure the asset is valid without revealing sensitive registry data to the public blockchain.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">Live Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Legal Status:</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">ZKP Provider:</span>
                    <span className="text-slate-900 dark:text-slate-300 font-mono">Midnight V1</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Network:</span>
                    <span className="text-slate-900 dark:text-slate-300">Testnet-Alpha</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <List className="h-5 w-5" />
                Property Portfolio
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Manage your registered properties and their tokenization status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No Properties Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Register your first property to start building your tokenized real estate portfolio.
                  </p>
                  <Button onClick={() => setActiveTab('register')} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Register Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <Card key={property.id} className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{property.title}</h4>
                            <Badge className={getStatusColor(property.status)}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Total Value:</span>
                              <div className="font-semibold text-slate-900 dark:text-white">${property.totalValue.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Total Tokens:</span>
                              <div className="font-semibold text-slate-900 dark:text-white">{property.totalTokens.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Tokens Minted:</span>
                              <div className="font-semibold text-slate-900 dark:text-white">{property.tokensMinted.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Created:</span>
                              <div className="font-semibold text-slate-900 dark:text-white">{new Date(property.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>

                          {property.hash && (
                            <div className="mt-3 p-2 bg-slate-200 dark:bg-slate-600 rounded text-xs font-mono text-slate-900 dark:text-white">
                              <span className="text-slate-700 dark:text-slate-300">Hash: </span>
                              {property.hash}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button 
                            onClick={() => handleViewDetails(property)}
                            variant="outline" 
                            size="sm" 
                            className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {property.status === 'registered' && (
                            <Button 
                              onClick={handleMintTokens}
                              disabled={isMinting}
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white min-w-[110px]"
                            >
                              {isMinting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Minting...
                                </>
                              ) : (
                                <>
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                  Mint Tokens
                                </>
                              )}
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleDeleteProperty(property.id, property.title)}
                            variant="outline" 
                            size="sm" 
                            className="border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Notice */}
      <Card className="border border-blue-300 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Privacy & Security</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                All property data is secured with SHA-256 hashing and zero-knowledge proofs.
                Property ownership and transactions remain private while maintaining verifiability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}