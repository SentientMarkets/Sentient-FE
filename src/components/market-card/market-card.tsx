"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Coins, ChevronRight, BarChart3 } from "lucide-react";
import { formatEther } from "viem";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from './skeleton';
import Link from 'next/link';

// Import ClientWrapper
import ClientWrapper from '@/components/wrapper/client-wrapper';

interface Market {
  id: string;
  address: `0x${string}`;
  question: string;
  endTime: bigint;
  collateralToken: `0x${string}`;
  virtualLiquidity: bigint;
}

interface MarketCardProps {
  market: Market;
}

function getBadgeVariant(endTime: bigint) {
  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  
  if (endTime <= currentTime) {
    return "destructive";
  }
  
  // If less than 24 hours remaining
  if (endTime - currentTime < BigInt(86400)) {
    return "warning";
  }
  
  return "default";
}

export function MarketCard({ market }: MarketCardProps) {
  const router = useRouter();
  const [yesPrice, setYesPrice] = useState<string>("0.5");
  const [noPrice, setNoPrice] = useState<string>("0.5");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading prices
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real implementation, these would come from the contract
      setYesPrice((Math.random() * 0.5 + 0.25).toFixed(2));
      setNoPrice((Math.random() * 0.5 + 0.25).toFixed(2));
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [market.id]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const isEnded = market.endTime <= currentTime;
  const statusText = isEnded ? "Ended" : "Trading";

  const stats = [
    {
      icon: <Coins className="h-4 w-4 text-indigo-400" />,
      value: `${formatEther(market.virtualLiquidity)} MODE`,
      label: "Liquidity",
    },
    {
      icon: <BarChart3 className="h-4 w-4 text-indigo-400" />,
      value: `${yesPrice} / ${noPrice}`,
      label: "Yes/No Price",
    },
    {
      icon: <Clock className="h-4 w-4 text-indigo-400" />,
      value: isEnded ? "Ended" : DateTime.fromSeconds(Number(market.endTime)).toRelative() || "Unknown",
      label: "Ends",
    },
  ];

  return (
    <ClientWrapper>
      <Card className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-500/20 group">
        <div className="p-6 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-xl font-bold text-white line-clamp-1">{market.question}</h3>
            <Badge
              variant={getBadgeVariant(market.endTime)}
              className="font-mono bg-indigo-500/20 text-indigo-300"
            >
              {statusText}
            </Badge>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2 relative z-10 mb-4">
            ID: {market.id.substring(0, 10)}...{market.id.substring(market.id.length - 8)}
          </p>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-800/50 border border-indigo-500/20"
              >
                {stat.icon}
                <span className="mt-2 font-mono font-medium text-indigo-300 text-sm">{stat.value}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/50">
              Prediction
            </Badge>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/50">
              MODE
            </Badge>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/50">
              AI
            </Badge>
          </div>
        </div>

        <div className="mt-auto p-6 pt-0">
          <Link href={`/markets/${market.id}`}>
            <Button
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 group-hover:animate-pulse"
            >
              <Brain className="w-4 h-4 mr-2" />
              View Market
              <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </div>
      </Card>
    </ClientWrapper>
  );
}