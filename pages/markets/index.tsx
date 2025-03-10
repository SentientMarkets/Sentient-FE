"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Market, formatPriceAsPercentage } from '@/lib/sentient/market';
import ClientWrapper from '@/components/wrapper/client-wrapper';
import { formatDistanceToNow } from 'date-fns';

// Mock function to fetch markets (replace with actual API call)
async function fetchMarkets(): Promise<Market[]> {
  // In a real implementation, this would call your API
  // For now, we'll return mock data
  return [
    {
      id: '1',
      address: '0x1234567890123456789012345678901234567890' as any,
      question: 'Will ETH price exceed $5,000 by the end of 2024?',
      endTime: new Date('2024-12-31T23:59:59Z'),
      collateralToken: {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as any,
        symbol: 'DAI',
        decimals: 18
      },
      virtualLiquidity: '10000',
      yesPrice: '0.65',
      noPrice: '0.35',
      volume: '25000',
      liquidity: '15000',
      createdAt: new Date('2024-01-15T12:00:00Z'),
      creator: '0xabcdef1234567890abcdef1234567890abcdef12' as any,
      category: 'Crypto',
      description: 'This market resolves to YES if the price of Ethereum (ETH) exceeds $5,000 USD at any point before the end of 2024, according to the Coinbase price feed.',
      resolution: null,
      resolutionTime: null
    },
    {
      id: '2',
      address: '0x0987654321098765432109876543210987654321' as any,
      question: 'Will the US Federal Reserve cut interest rates in Q3 2024?',
      endTime: new Date('2024-09-30T23:59:59Z'),
      collateralToken: {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as any,
        symbol: 'DAI',
        decimals: 18
      },
      virtualLiquidity: '15000',
      yesPrice: '0.72',
      noPrice: '0.28',
      volume: '35000',
      liquidity: '20000',
      createdAt: new Date('2024-02-10T09:30:00Z'),
      creator: '0xabcdef1234567890abcdef1234567890abcdef12' as any,
      category: 'Finance',
      description: 'This market resolves to YES if the Federal Reserve announces a reduction in the federal funds rate during any of its meetings in July, August, or September 2024.',
      resolution: null,
      resolutionTime: null
    },
    {
      id: '3',
      address: '0xaabbccddeeffaabbccddeeffaabbccddeeffaabb' as any,
      question: 'Will Bitcoin halving in 2024 lead to a new all-time high within 3 months?',
      endTime: new Date('2024-07-31T23:59:59Z'),
      collateralToken: {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as any,
        symbol: 'DAI',
        decimals: 18
      },
      virtualLiquidity: '12000',
      yesPrice: '0.58',
      noPrice: '0.42',
      volume: '42000',
      liquidity: '18000',
      createdAt: new Date('2024-03-05T14:15:00Z'),
      creator: '0x1122334455667788990011223344556677889900' as any,
      category: 'Crypto',
      description: 'This market resolves to YES if the price of Bitcoin (BTC) reaches a new all-time high (above $69,000) within 3 months after the April 2024 halving event.',
      resolution: null,
      resolutionTime: null
    }
  ];
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load markets
  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMarkets();
        setMarkets(data);
        setFilteredMarkets(data);
      } catch (error) {
        console.error('Error loading markets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkets();
  }, []);

  // Filter markets based on search query and category
  useEffect(() => {
    let filtered = markets;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(market => 
        market.question.toLowerCase().includes(query) || 
        market.description?.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(market => market.category === selectedCategory);
    }
    
    setFilteredMarkets(filtered);
  }, [searchQuery, selectedCategory, markets]);

  // Get unique categories
  const categories = Array.from(new Set(markets.map(market => market.category).filter(Boolean)));

  // Format date for display - only run on client
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Calculate time remaining - only run on client
  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const timeRemaining = endTime.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      return 'Ended';
    }
    
    return formatDistanceToNow(endTime, { addSuffix: true });
  };

  // Create a loading skeleton for the markets page
  const loadingSkeleton = (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Prediction Markets</h1>
          <p className="text-muted-foreground">
            Trade on the outcome of future events with real-time market prices
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <ClientWrapper fallback={loadingSkeleton}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prediction Markets</h1>
            <p className="text-muted-foreground">
              Trade on the outcome of future events with real-time market prices
            </p>
          </div>
          <Link href="/markets/create">
            <Button className="mt-4 md:mt-0">Create Market</Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-2/3">
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="text-center py-12 border rounded-md">
            <p className="text-muted-foreground mb-4">No markets found matching your criteria</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <Card key={market.id} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{market.question}</CardTitle>
                    {market.category && (
                      <Badge>
                        {market.category}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {formatDate(market.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">YES Price</div>
                        <div className="font-medium">{formatPriceAsPercentage(market.yesPrice)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">NO Price</div>
                        <div className="font-medium">{formatPriceAsPercentage(market.noPrice)}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Ends</div>
                      <div className="font-medium">{getTimeRemaining(market.endTime)}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/markets/${market.id}`} className="w-full">
                    <Button className="w-full">View Market</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientWrapper>
  );
} 