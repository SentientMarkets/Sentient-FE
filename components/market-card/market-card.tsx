'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatEther } from 'viem';

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

export function MarketCard({ market }: MarketCardProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only render time-sensitive content on the client
  if (!mounted) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{market.question}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ends:</span>
              <span>Loading...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liquidity:</span>
              <span>{formatEther(market.virtualLiquidity)} ETH</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/markets/${market.id}`} className="w-full">
            <Button className="w-full">View Market</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }
  
  const isExpired = Date.now() > Number(market.endTime) * 1000;
  const timeLeft = formatDistanceToNow(new Date(Number(market.endTime) * 1000), { addSuffix: true });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{market.question}</CardTitle>
          <Badge>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ends:</span>
            <span>{timeLeft}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Liquidity:</span>
            <span>{formatEther(market.virtualLiquidity)} ETH</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/markets/${market.id}`} className="w-full">
          <Button className="w-full">View Market</Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 