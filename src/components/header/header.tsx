'use client';

import Link from "next/link"
import Image from "next/image"
import { Brain, BarChart3, PlusCircle, BookOpen } from 'lucide-react'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import type React from "react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-md border-b border-indigo-700/20">
      <div className="container mx-auto px-4 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-400" />
            <span className="font-bold text-xl text-white">Sentient Markets</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          <Link 
            href="/" 
            className="flex items-center text-indigo-200/80 hover:text-indigo-100 transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="text-sm">Markets</span>
          </Link>
          <Link 
            href="/create-market" 
            className="flex items-center text-indigo-200/80 hover:text-indigo-100 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Create Market</span>
          </Link>
          <a 
            href="https://github.com/sentient-markets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-indigo-200/80 hover:text-indigo-100 transition-colors"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="text-sm">Documentation</span>
          </a>
          <div className="ml-6">
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                const ready = mounted
                const connected = ready && account && chain

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="flex items-center px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20 transition-colors"
                          >
                            <span className="text-sm">Connect Wallet</span>
                          </button>
                        )
                      }

                      if (chain.unsupported) {
                        return (
                          <button 
                            onClick={openChainModal}
                            className="flex items-center px-4 py-2 rounded-lg bg-red-500/10 text-red-200 hover:bg-red-500/20 transition-colors"
                          >
                            Wrong network
                          </button>
                        )
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={openChainModal}
                            className="flex items-center px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20 transition-colors"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: "hidden",
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <Image
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl || "/placeholder.svg"}
                                    width={12}
                                    height={12}
                                  />
                                )}
                              </div>
                            )}
                            <span className="text-sm">{chain.name}</span>
                          </button>

                          <button
                            onClick={openAccountModal}
                            className="flex items-center px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20 transition-colors"
                          >
                            <span className="text-sm">
                              {account.displayName}
                              {account.displayBalance ? ` (${account.displayBalance})` : ""}
                            </span>
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>
          </div>
        </nav>
      </div>
    </header>
  )
}