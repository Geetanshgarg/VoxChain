"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { WalletIcon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";

export default function WalletConnect({
  onAccountChange,
}: {
  onAccountChange: (account: string | null) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          onAccountChange(accounts[0]);
        } else {
          setAddress(null);
          onAccountChange(null);
        }
      });
    }
  }, [onAccountChange]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          onAccountChange(accounts[0]);
        }
      } catch (e) {
        console.error("Checking connection failed", e);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed. Please install it to continue.");
      return;
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      onAccountChange(accounts[0]);
      toast.success("Wallet connected!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  };

  const disconnect = () => {
     setAddress(null);
     onAccountChange(null);
  };

  if (address) {
    return (
      <div className="flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Disconnect (Local Session)"
        >
          <LogOutIcon size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <WalletIcon size={16} />
      Connect Wallet
    </button>
  );
}
