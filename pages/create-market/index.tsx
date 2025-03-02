import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import the component with no SSR to prevent hydration errors
const CreateMarketFormNoSSR = dynamic(
  () => import("@/components/create-market/create-market"),
  { ssr: false }
);

export default function CreateMarketPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="h-8 w-8 bg-indigo-400 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <h1 className="text-3xl font-bold">Create Prediction Market</h1>
        </div>
        {mounted ? <CreateMarketFormNoSSR /> : (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-pulse">Loading...</div>
          </div>
        )}
      </div>
    </div>
  )
}