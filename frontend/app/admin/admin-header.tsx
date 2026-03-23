"use client";

import { Bell, Settings, Menu, LogOut, Copy, Check, User as UserIcon, Wallet, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcherButton } from "@/components/custom/theme-switcher-button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWalletState, useWalletConnection } from "@/components/providers/wallet-provider";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { ReapLogo } from "@/components/custom/reap-logo";
import { formatAddress, isWalletInstalled } from "@/lib/midnight-utils";

export function AdminHeader() {
  const { toggleSidebar } = useSidebar();
  const { address, isConnecting, error, networkId, balances } = useWalletState();
  const { isConnected, disconnectWallet, connectWallet } = useWalletConnection();
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Get user initials from email or name
  const getInitials = () => {
    if (user?.username) {
      return user.username
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectClick = () => {
    setShowWalletModal(true);
  };

  const handleConnect = async () => {
    const result = await connectWallet();
    if (result.success) {
      setShowWalletModal(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
  };

  const handleLogout = () => {
    logout();
  };

  const shortAddress = address ? formatAddress(address, 8) : '';
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const walletDetected = isWalletInstalled();

  return (
    <>
      <header className="w-full border-b bg-white dark:bg-[#2a2a2a] border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between h-16 px-4 md:px-8 gap-6 text-slate-700 dark:text-slate-300">
          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Left Section */}
          <div className="flex-1 flex items-center gap-3">
            <ReapLogo size={24} className="opacity-80 group-hover:opacity-100 transition-opacity" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Theme Switcher */}
            <ThemeSwitcherButton className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" />

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Wallet Connection Status */}
            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-3 py-2 h-9 text-slate-700 dark:text-slate-300 border-green-300 dark:border-green-700 hover:border-green-500 bg-green-50 dark:bg-green-950/30 shadow-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono">{shortAddress}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {/* Wallet info header */}
                  <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">Connected · Midnight {networkId || 'preprod'}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">{address}</p>
                    {balances && (
                      <div className="mt-1.5 flex gap-2 flex-wrap">
                        {balances.dust && balances.dust.balance !== "0" && (
                          <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded font-mono">
                            {balances.dust.balance} DUST
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
                    {!copied ? (
                      <Copy className="mr-2 h-4 w-4" />
                    ) : (
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                    )}
                    {copied ? 'Copied!' : 'Copy Address'}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleDisconnect} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                onClick={handleConnectClick}
                disabled={isConnecting}
                className="flex items-center gap-2 px-3 py-2 h-9 border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-slate-800 shadow-sm text-sm font-medium transition-all"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-xs">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-xs">Connect Wallet</span>
                  </>
                )}
              </Button>
            )}

            {/* User Profile */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 py-2 h-9 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.profilePicture || undefined} alt={displayName} />
                      <AvatarFallback className="text-xs font-semibold bg-slate-200 dark:bg-slate-700">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:inline">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture || undefined} alt={displayName} />
                        <AvatarFallback className="text-sm font-semibold">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user.username || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Role: <span className="font-medium capitalize">{user.role}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem asChild>
                    <a href="/admin/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      View Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Wallet Connect Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-500" />
              Connect Midnight Wallet
            </DialogTitle>
            <DialogDescription>
              Connect your Lace wallet to access Midnight Network features.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Error display */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Wallet not installed warning */}
            {!walletDetected && !isConnecting && (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Lace Wallet not detected</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      You need to install the Lace Beta wallet extension and enable the Midnight Network feature.
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.lace.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Download Lace Wallet
                </a>
              </div>
            )}

            {/* Lace wallet option */}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                ${isConnecting
                  ? 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-white dark:bg-slate-800/50'
                }
                ${!walletDetected ? 'opacity-60' : ''}
              `}
            >
              {/* Lace Icon */}
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
                L
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">Lace Wallet</p>
                  {walletDetected && (
                    <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                      Detected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official Midnight Network wallet with ZK privacy support
                </p>
              </div>

              {isConnecting ? (
                <Loader2 className="h-5 w-5 text-purple-500 animate-spin shrink-0" />
              ) : (
                <div className={`h-2 w-2 rounded-full shrink-0 ${walletDetected ? 'bg-green-500' : 'bg-slate-300'}`} />
              )}
            </button>

            {/* Status text */}
            {isConnecting && (
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 animate-pulse">
                Waiting for wallet approval... Check your Lace extension.
              </p>
            )}

            {/* Info footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1 border-t">
              <span>Midnight Network · PREPROD</span>
              <a
                href="https://docs.midnight.network"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Docs
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
