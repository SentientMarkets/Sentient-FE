'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/lib/sentient/market';

interface MarketInfoProps {
  market: Market | null;
  isLoading: boolean;
}

export function MarketInfo({ market, isLoading }: MarketInfoProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !market) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded" />
            <div className="h-24 bg-muted animate-pulse rounded" />
            <div className="h-6 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format date for display
  const formatDate = (date: Date) => {
    if (!mounted) return 'Loading...';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!mounted) return 'Loading...';
    
    const now = new Date();
    const timeRemaining = market.endTime.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      return 'Market has ended';
    }
    
    return formatDistanceToNow(market.endTime, { addSuffix: true });
  };

  // If not mounted yet, render a simplified version without time-sensitive content
  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Market Information</CardTitle>
            {market.category && (
              <Badge>
                {market.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{market.question}</h3>
              <p className="text-muted-foreground text-sm">{market.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                <p>Loading...</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Ends</h4>
                <p>Loading...</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Time Remaining</h4>
                <p>Loading...</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Creator</h4>
                <p className="truncate">{market.creator}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>Market Information</CardTitle>
          {market.category && (
            <Badge>
              {market.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{market.question}</h3>
            <p className="text-muted-foreground text-sm">{market.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
              <p>{formatDate(market.createdAt)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Ends</h4>
              <p>{formatDate(market.endTime)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Time Remaining</h4>
              <p>{getTimeRemaining()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Creator</h4>
              <p className="truncate">{market.creator}</p>
            </div>
          </div>
          
          {market.resolution !== null && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Resolution</h4>
              <Badge>
                {market.resolution ? "YES" : "NO"}
              </Badge>
              {market.resolutionTime && (
                <p className="text-sm text-muted-foreground mt-1">
                  Resolved on {formatDate(market.resolutionTime)}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 