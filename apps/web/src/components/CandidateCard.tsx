"use client";

import { Loader2 } from "lucide-react";

interface CandidateCardProps {
  id: number;
  name: string;
  voteCount: number;
  isVoting: boolean;
  hasVoted: boolean;
  onVote: (id: number) => void;
}

export default function CandidateCard({
  id,
  name,
  voteCount,
  isVoting,
  hasVoted,
  onVote,
}: CandidateCardProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-black text-primary leading-none">
            {voteCount}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
            Votes
          </span>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={() => onVote(id)}
          disabled={isVoting || hasVoted}
          className="w-full flex justify-center items-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVoting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : hasVoted ? (
            "Vote Cast"
          ) : (
            "Vote"
          )}
        </button>
      </div>
    </div>
  );
}
