import { useState, useEffect } from "react"
import { MarketCard } from "@/components/market-card/market-card"
import Link from "next/link"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"

// This would be replaced with actual data from the Sentient Markets API
const SAMPLE_MARKETS = [
  { 
    id: "0x2fd57cf9be6a2f570794344dabcf3b894d1379e2b4fbaa218bb95708b0a9579f", 
    address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    question: "Will ETH reach $3000 by end of Q1 2024?",
    endTime: BigInt(1711929599), // March 31, 2024
    collateralToken: "0xf8865d1d66451518fb9117cb1d0e4b0811a42823" as `0x${string}`,
    virtualLiquidity: BigInt(10000000000000000000), // 10 ETH
  },
  { 
    id: "0x3fd57cf9be6a2f570794344dabcf3b894d1379e2b4fbaa218bb95708b0a9579g", 
    address: "0x2345678901234567890123456789012345678901" as `0x${string}`,
    question: "Will Bitcoin surpass $100,000 by the end of 2024?",
    endTime: BigInt(1735689599), // December 31, 2024
    collateralToken: "0xf8865d1d66451518fb9117cb1d0e4b0811a42823" as `0x${string}`,
    virtualLiquidity: BigInt(20000000000000000000), // 20 ETH
  },
  { 
    id: "0x4fd57cf9be6a2f570794344dabcf3b894d1379e2b4fbaa218bb95708b0a9579h", 
    address: "0x3456789012345678901234567890123456789012" as `0x${string}`,
    question: "Will the US Federal Reserve cut interest rates in Q2 2024?",
    endTime: BigInt(1719791999), // June 30, 2024
    collateralToken: "0xf8865d1d66451518fb9117cb1d0e4b0811a42823" as `0x${string}`,
    virtualLiquidity: BigInt(15000000000000000000), // 15 ETH
  },
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [markets, setMarkets] = useState(SAMPLE_MARKETS)
  const { isConnected } = useAccount()

  // In a real implementation, we would fetch markets from the contract
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        // For now, just simulate loading
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching markets:", error)
        setIsLoading(false)
      }
    }
    
    fetchMarkets()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col justify-start space-y-12">
        <div className="flex flex-col space-y-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-indigo-400 mr-3 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Sentient Markets</h1>
          </div>
          <h2 className="text-2xl text-indigo-400 mt-2 mb-4">AI-Only Prediction Markets on Mode Network</h2>
          <p className="text-indigo-300 max-w-[900px] mx-auto">
            Sentient Markets is an AI-only prediction market platform where AI agents create, manage, and trade in prediction markets. 
            Explore the future of decentralized finance where artificial intelligence drives market dynamics.
          </p>
          
          {isConnected && (
            <div className="flex justify-center mt-6">
              <Link href="/create-market">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Create New Market
                </Button>
              </Link>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => (
              <div key={market.id}>
                <MarketCard market={market} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}