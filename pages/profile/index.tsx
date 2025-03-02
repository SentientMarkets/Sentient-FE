"use client"

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ClientWrapper from '@/components/wrapper/client-wrapper';
import { formatDistanceToNow } from 'date-fns';

// Mock user data - replace with actual data fetching
const mockUserData = {
  address: '0x1234...5678',
  joinedDate: new Date('2023-10-15'),
  balance: '1,250.00 DAI',
  positions: [
    {
      id: '1',
      marketId: '1',
      marketQuestion: 'Will ETH price exceed $5,000 by the end of 2024?',
      outcome: 'YES',
      shares: '100',
      avgPrice: '0.65',
      currentValue: '75.00 DAI',
      profit: '10.00',
      profitPercentage: '15.38',
      timestamp: new Date('2024-01-20')
    },
    {
      id: '2',
      marketId: '3',
      marketQuestion: 'Will Bitcoin halving in 2024 lead to a new all-time high within 3 months?',
      outcome: 'NO',
      shares: '50',
      avgPrice: '0.42',
      currentValue: '25.00 DAI',
      profit: '-4.00',
      profitPercentage: '-13.79',
      timestamp: new Date('2024-03-10')
    }
  ],
  transactions: [
    {
      id: '1',
      type: 'BUY',
      marketId: '1',
      outcome: 'YES',
      amount: '65.00 DAI',
      shares: '100',
      timestamp: new Date('2024-01-20')
    },
    {
      id: '2',
      type: 'BUY',
      marketId: '3',
      outcome: 'NO',
      amount: '21.00 DAI',
      shares: '50',
      timestamp: new Date('2024-03-10')
    },
    {
      id: '3',
      type: 'DEPOSIT',
      amount: '1,000.00 DAI',
      timestamp: new Date('2023-12-15')
    }
  ]
};

export default function ProfilePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Loading state for the profile page
  const loadingProfile = (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  // Not connected state
  if (!isConnected) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Connect your wallet to view your profile, positions, and transaction history.
          </p>
          <Button size="lg">Connect Wallet</Button>
        </div>
      </div>
    );
  }
  
  return (
    <ClientWrapper fallback={loadingProfile}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account, positions, and settings
              </p>
            </div>
            <Button className="mt-4 md:mt-0">Deposit Funds</Button>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {mockUserData.address.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <CardTitle>{mockUserData.address}</CardTitle>
                  <CardDescription>
                    Joined {formatDistanceToNow(mockUserData.joinedDate, { addSuffix: true })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="positions">Positions</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Available Balance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{mockUserData.balance}</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Positions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{mockUserData.positions.length}</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Transactions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{mockUserData.transactions.length}</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                      <div className="space-y-4">
                        {mockUserData.transactions.slice(0, 3).map((tx) => (
                          <div key={tx.id} className="flex justify-between items-center p-4 border rounded-md">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={tx.type === 'DEPOSIT' ? 'default' : tx.type === 'BUY' ? 'outline' : 'destructive'}>
                                  {tx.type}
                                </Badge>
                                {tx.marketId && (
                                  <span className="text-sm font-medium truncate max-w-[200px]">
                                    {tx.outcome && `${tx.outcome} - `}
                                    {mockUserData.positions.find(p => p.marketId === tx.marketId)?.marketQuestion}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{tx.amount}</div>
                              {tx.shares && (
                                <div className="text-sm text-muted-foreground">{tx.shares} shares</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="positions">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Your Positions</h3>
                    {mockUserData.positions.length === 0 ? (
                      <div className="text-center py-12 border rounded-md">
                        <p className="text-muted-foreground">You don&apos;t have any positions yet</p>
                        <Button className="mt-4">Explore Markets</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mockUserData.positions.map((position) => (
                          <div key={position.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="font-medium mb-1">{position.marketQuestion}</div>
                                <div className="flex items-center space-x-2">
                                  <Badge>{position.outcome}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {position.shares} shares @ {position.avgPrice}
                                  </span>
                                </div>
                              </div>
                              <Button size="sm">Sell</Button>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground mb-1">Current Value</div>
                                <div>{position.currentValue}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground mb-1">Profit/Loss</div>
                                <div className={parseFloat(position.profit) >= 0 ? 'text-green-500' : 'text-red-500'}>
                                  {parseFloat(position.profit) >= 0 ? '+' : ''}{position.profit} DAI
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground mb-1">Change</div>
                                <div className={parseFloat(position.profitPercentage) >= 0 ? 'text-green-500' : 'text-red-500'}>
                                  {parseFloat(position.profitPercentage) >= 0 ? '+' : ''}{position.profitPercentage}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <div className="font-medium">Notification Preferences</div>
                          <div className="text-sm text-muted-foreground">
                            Manage how you receive notifications
                          </div>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <div className="font-medium">Connected Wallets</div>
                          <div className="text-sm text-muted-foreground">
                            Manage your connected wallets
                          </div>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <div className="font-medium">Display Settings</div>
                          <div className="text-sm text-muted-foreground">
                            Customize your display preferences
                          </div>
                        </div>
                        <Button variant="outline">Customize</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientWrapper>
  );
}