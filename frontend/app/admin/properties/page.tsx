"use client";

import { useState } from 'react';
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
  Shield
} from 'lucide-react';
import { PropertyRegistration } from '@/components/property-registration';

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
  const [activeTab, setActiveTab] = useState('register');
  const [properties] = useState<Property[]>([
    // Mock data - replace with real data from API
    {
      id: 'prop_001',
      title: 'Downtown Office Complex',
      status: 'tokenized',
      totalValue: 2500000,
      totalTokens: 1000,
      tokensMinted: 1000,
      createdAt: '2024-01-15',
      hash: 'a1b2c3d4...'
    }
  ]);

  const handlePropertyRegistered = (propertyId: string) => {
    // Refresh properties list or navigate to tokenization
    console.log('Property registered:', propertyId);
    setActiveTab('manage');
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
        </TabsContent>

        <TabsContent value="tokenize" className="mt-6">
          <div className="space-y-6">
            {/* Token Minting Interface */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <TrendingUp className="h-5 w-5" />
                  Token Minting Dashboard
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Mint tokens for registered properties and manage token distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Property Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">Select Property</label>
                    <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400">
                      <option value="" className="text-slate-900">Choose a registered property...</option>
                      {properties
                        .filter(p => p.status === 'registered')
                        .map(property => (
                          <option key={property.id} value={property.id} className="text-slate-900">
                            {property.title} - ${property.totalValue.toLocaleString()}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Token Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900 dark:text-white">Total Token Supply</label>
                      <input
                        type="number"
                        placeholder="1000"
                        className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900 dark:text-white">Token Price (USD)</label>
                      <input
                        type="number"
                        placeholder="2500"
                        className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Distribution Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-white">Token Distribution</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-white">Platform Reserve (%)</label>
                        <input
                          type="number"
                          placeholder="10"
                          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-white">Liquidity Pool (%)</label>
                        <input
                          type="number"
                          placeholder="20"
                          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-white">Public Sale (%)</label>
                        <input
                          type="number"
                          placeholder="70"
                          className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mint Button */}
                  <div className="flex justify-end">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                      <TrendingUp className="h-4 w-4" />
                      Mint Tokens
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tokenized Properties List */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Tokenized Properties</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Properties that have been successfully tokenized
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
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {property.tokensMinted.toLocaleString()} tokens minted
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-900 dark:text-white">${property.totalValue.toLocaleString()}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              ${(property.totalValue / property.totalTokens).toFixed(2)} per token
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
                          <Button variant="outline" size="sm" className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {property.status === 'registered' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Mint Tokens
                            </Button>
                          )}
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