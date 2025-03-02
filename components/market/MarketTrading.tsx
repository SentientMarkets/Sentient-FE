'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Market, formatPriceAsPercentage } from '@/lib/sentient/market';

interface MarketTradingProps {
  market: Market | null;
  onBuyShares: (outcome: 'YES' | 'NO', amount: string) => Promise<void>;
  isBuying: boolean;
  error: Error | null;
  isConnected: boolean;
}

export function MarketTrading({ 
  market, 
  onBuyShares,
  isBuying,
  error,
  isConnected
}: MarketTradingProps) {
  const [position, setPosition] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !market) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="h-12 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    // In a real implementation, this would be the user's balance
    setAmount('100');
  };

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) === 0) return;
    await onBuyShares(position === 'yes' ? 'YES' : 'NO', amount);
    // Reset form on success
    if (!error) {
      setAmount('');
    }
  };

  // Calculate estimated outcome
  const getEstimatedOutcome = () => {
    if (!amount || parseFloat(amount) === 0) return '0';
    
    const amountValue = parseFloat(amount);
    const price = position === 'yes' ? parseFloat(market.yesPrice) : parseFloat(market.noPrice);
    
    // Simple calculation: amount / price
    // In a real implementation, this would use a more complex formula based on the AMM
    const shares = amountValue / price;
    
    return shares.toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">YES Price</div>
              <div className="text-xl font-semibold">{formatPriceAsPercentage(market.yesPrice)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">NO Price</div>
              <div className="text-xl font-semibold">{formatPriceAsPercentage(market.noPrice)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Liquidity</div>
              <div className="text-xl font-semibold">{market.liquidity} {market.collateralToken.symbol}</div>
            </div>
          </div>
          
          {isConnected ? (
            <>
              <Tabs defaultValue="yes" className="w-full" onValueChange={(value) => setPosition(value as 'yes' | 'no')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="yes">YES</TabsTrigger>
                  <TabsTrigger value="no">NO</TabsTrigger>
                </TabsList>
                <TabsContent value="yes" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Amount ({market.collateralToken.symbol})</label>
                        <button 
                          className="text-xs text-primary hover:underline" 
                          onClick={handleMaxClick}
                        >
                          MAX
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder={`0.00 ${market.collateralToken.symbol}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Estimated Outcome</div>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between">
                          <span>YES Shares:</span>
                          <span>{getEstimatedOutcome()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="text-sm text-red-500">
                        {error.message}
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="no" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Amount ({market.collateralToken.symbol})</label>
                        <button 
                          className="text-xs text-primary hover:underline" 
                          onClick={handleMaxClick}
                        >
                          MAX
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder={`0.00 ${market.collateralToken.symbol}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Estimated Outcome</div>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between">
                          <span>NO Shares:</span>
                          <span>{getEstimatedOutcome()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="text-sm text-red-500">
                        {error.message}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <Button 
                className="w-full" 
                disabled={!amount || parseFloat(amount) === 0 || isBuying}
                onClick={handleTrade}
              >
                {isBuying ? 'Processing...' : `Buy ${position.toUpperCase()}`}
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Connect your wallet to trade</p>
              <Button>Connect Wallet</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 