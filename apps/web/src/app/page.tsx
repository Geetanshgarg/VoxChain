"use client";

import { useState, useEffect, useCallback } from "react";
import WalletConnect from "@/components/WalletConnect";
import CandidateCard from "@/components/CandidateCard";
import { getContract, getReadOnlyContract } from "@/lib/contract";
import { toast } from "sonner";
import { RefreshCwIcon } from "lucide-react";

const CANDIDATES = [
  { id: 1, name: "Candidate 1" },
  { id: 2, name: "Candidate 2" },
  { id: 3, name: "Candidate 3" },
];

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});
  const [isVoting, setIsVoting] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchResults = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const contract = await getReadOnlyContract();
      
      const newCounts: Record<number, number> = {};
      for (const candidate of CANDIDATES) {
        const count = await contract.votes(candidate.id);
        newCounts[candidate.id] = Number(count);
      }
      setVoteCounts(newCounts);
    } catch (error) {
      console.error("Failed to fetch votes:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults, walletAddress]);

  const handleVote = async (candidateId: number) => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

    try {
      setIsVoting(candidateId);
      const contract = await getContract();
      
      const tx = await contract.vote(candidateId);
      toast.info("Transaction pending... Please wait.");
      
      await tx.wait();
      
      toast.success("Vote recorded successfully on the blockchain!");
      setHasVoted(true);
      
      await fetchResults();
    } catch (error: any) {
      console.error("Voting failed:", error);
      
      if (error?.info?.error?.message) {
        toast.error(error.info.error.message);
      } else if (error?.reason) {
        toast.error(error.reason);
      } else if (error?.message) {
        try {
           const parsed = JSON.parse(error.message.split("error=")[1].split(",")[0]);
           toast.error(parsed.message || "An error occurred");
        } catch {
             toast.error(error.shortMessage || error.message || "Transaction failed.");
        }
      } else {
        toast.error("Transaction failed or was rejected.");
      }
    } finally {
      setIsVoting(null);
    }
  };

  return (
    <div className="flex flex-col bg-background p-4 md:p-8">
      <main className="container mx-auto max-w-5xl flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-br from-primary to-blue-500 bg-clip-text text-transparent">
              Live Election
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Cast your vote securely on the blockchain. Ensure you are connected to the <strong>Sepolia Testnet</strong> to participate.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <WalletConnect onAccountChange={setWalletAddress} />
            <button 
              onClick={fetchResults}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50 text-sm font-medium h-10 w-full sm:w-auto justify-center"
            >
              <RefreshCwIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {!walletAddress && (
          <div className="mb-8 p-4 border border-blue-200 bg-blue-50/50 text-blue-800 rounded-lg dark:bg-blue-900/10 dark:border-blue-800/50 dark:text-blue-400 backdrop-blur-sm">
            <strong>Welcome!</strong> Please connect your wallet to view live data and participate in the election.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {CANDIDATES.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              id={candidate.id}
              name={candidate.name}
              voteCount={voteCounts[candidate.id] || 0}
              isVoting={isVoting === candidate.id}
              hasVoted={hasVoted}
              onVote={handleVote}
            />
          ))}
        </div>
        
        <div className="mt-auto pt-16 text-center text-sm text-muted-foreground">
          <p>Powered by Ethereum & Ethers.js</p>
        </div>
      </main>
    </div>
  );
}
