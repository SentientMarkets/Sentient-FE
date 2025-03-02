"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Clock, Coins, ArrowLeft, BarChart3, Loader2, ThumbsUp, ThumbsDown } from "lucide-react"
import { formatEther } from "viem"
import { DateTime } from "luxon"
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MarketDetail() {
  const router = useRouter()
  const { id } = router.query
  const { isConnected } = useAccount()
  
  const [isLoading, setIsLoading] = useState(true)
  const [market, setMarket] = useState<any>(null)
  const [yesPrice, setYesPrice] = useState<string>("0.5")
  const [noPrice, setNoPrice] = useState<string>("0.5")
  const [tradeAmount, setTradeAmount] = useState<string>("1")
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!id) return

    // Simulate fetching market data
    const timer = setTimeout(() => {
      // This would be replaced with actual API call
      setMarket({
        id: id as string,
        address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
        question: "Will ETH reach $3000 by end of Q1 2024?",
        endTime: BigInt(1711929599), // March 31, 2024
        collateralToken: "0xf8865d1d66451518fb9117cb1d0e4b0811a42823" as `0x${string}`,
        virtualLiquidity: BigInt(10000000000000000000), // 10 ETH
      })
      
      setYesPrice((Math.random() * 0.5 + 0.25).toFixed(2))
      setNoPrice((Math.random() * 0.5 + 0.25).toFixed(2))
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [id])

  const handleTrade = async (isYes: boolean) => {
    if (!isConnected || !market) return
    
    setIsPending(true)
    
    try {
      // This would be replaced with actual contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsPending(false)
      setIsSuccess(true)
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Error trading:', error)
      setIsPending(false)
      alert('Failed to execute trade. Please try again.')
    }
  }

  if (isLoading || !market) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
      </div>
    )
  }

  const currentTime = BigInt(Math.floor(Date.now() / 1000))
  const isEnded = market.endTime <= currentTime
  const statusText = isEnded ? "Ended" : "Trading"

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-4xl">
        <Button 
          className="mb-6 text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Markets
        </Button>
        
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl border border-indigo-500/20 mb-6">
          <CardHeader className="relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">{market.question}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`bg-indigo-500/20 text-indigo-300 ${isEnded ? 'border-gray-500' : 'border-indigo-500'}`}>
                    {statusText}
                  </Badge>
                  <span className="text-sm text-gray-400">
                    ID: {market.id.substring(0, 10)}...{market.id.substring(market.id.length - 8)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col items-center p-4 rounded-lg bg-gray-800/50 border border-indigo-500/20">
                <Coins className="h-5 w-5 text-indigo-400 mb-2" />
                <span className="font-mono font-medium text-indigo-300">{formatEther(market.virtualLiquidity)} MODE</span>
                <span className="text-xs text-gray-500">Liquidity</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-gray-800/50 border border-indigo-500/20">
                <BarChart3 className="h-5 w-5 text-indigo-400 mb-2" />
                <div className="font-mono font-medium text-indigo-300">
                  <span className="text-green-400">{yesPrice}</span> / <span className="text-red-400">{noPrice}</span>
                </div>
                <span className="text-xs text-gray-500">Yes/No Price</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-gray-800/50 border border-indigo-500/20">
                <Clock className="h-5 w-5 text-indigo-400 mb-2" />
                <span className="font-mono font-medium text-indigo-300">
                  {isEnded ? "Ended" : DateTime.fromSeconds(Number(market.endTime)).toRelative() || "Unknown"}
                </span>
                <span className="text-xs text-gray-500">Ends {formatDate(market.endTime)}</span>
              </div>
            </div>
            
            <Tabs defaultValue="trade" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                <TabsTrigger value="trade" className="data-[state=active]:bg-indigo-600">Trade</TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-indigo-600">Market Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trade" className="mt-4">
                {!isConnected ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Brain className="h-12 w-12 text-indigo-400/50" />
                    <p className="text-center text-indigo-300">
                      Please connect your wallet to trade in this market
                    </p>
                    <ConnectButton />
                  </div>
                ) : isEnded ? (
                  <Alert className="bg-indigo-500/10 border-indigo-500/20">
                    <AlertDescription className="text-indigo-300">
                      This market has ended and is no longer available for trading.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="tradeAmount" className="text-indigo-300">Amount (MODE)</Label>
                      <Input
                        id="tradeAmount"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="bg-gray-800/50 border-indigo-500/20 text-indigo-300"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => handleTrade(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ThumbsUp className="mr-2 h-4 w-4" />
                        )}
                        Buy YES ({yesPrice})
                      </Button>
                      
                      <Button
                        onClick={() => handleTrade(false)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ThumbsDown className="mr-2 h-4 w-4" />
                        )}
                        Buy NO ({noPrice})
                      </Button>
                    </div>
                    
                    {isSuccess && (
                      <Alert className="bg-green-500/10 border-green-500/20">
                        <AlertDescription className="text-green-300">
                          Trade executed successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="info" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-300 mb-1">Market Details</h3>
                    <p className="text-gray-400">
                      This prediction market allows users to speculate on whether {market.question.toLowerCase()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-indigo-300 mb-1">How It Works</h3>
                    <p className="text-gray-400">
                      Buy YES tokens if you believe the outcome will be true, or NO tokens if you believe it will be false.
                      When the market resolves, winning positions can be redeemed for 1 MODE each.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-indigo-300 mb-1">Market Data</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><span className="text-indigo-300">Created:</span> {DateTime.fromSeconds(Number(market.endTime) - 86400 * 30).toFormat('LLL dd, yyyy')}</li>
                      <li><span className="text-indigo-300">Ends:</span> {formatDate(market.endTime)}</li>
                      <li><span className="text-indigo-300">Collateral Token:</span> MODE</li>
                      <li><span className="text-indigo-300">Contract Address:</span> {market.address}</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true,
  }) + " UTC";
}