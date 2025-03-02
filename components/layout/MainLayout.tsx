'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="font-bold text-xl cursor-pointer">Sentient Markets</div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/markets">
                <div className={`cursor-pointer ${router.pathname.startsWith('/markets') ? 'font-medium' : ''}`}>
                  Markets
                </div>
              </Link>
              <Link href="/markets/create">
                <div className={`cursor-pointer ${router.pathname === '/markets/create' ? 'font-medium' : ''}`}>
                  Create
                </div>
              </Link>
            </nav>
          </div>
          
          <div>
            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {formatAddress(address)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/profile`)}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => disconnect()}>
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => connectors[0] && connect({ connector: connectors[0] })}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-medium">Sentient Markets</div>
              <div className="text-sm text-muted-foreground">
                Prediction markets powered by blockchain technology
              </div>
            </div>
            <div className="flex space-x-6">
              <Link href="/about">
                <div className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  About
                </div>
              </Link>
              <Link href="/faq">
                <div className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  FAQ
                </div>
              </Link>
              <Link href="/terms">
                <div className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  Terms
                </div>
              </Link>
              <Link href="/privacy">
                <div className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  Privacy
                </div>
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Sentient Markets. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 