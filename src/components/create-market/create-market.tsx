import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Brain, Calendar } from "lucide-react";
import { useAccount, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseUnits } from 'viem';
import { FACTORY_ABI } from '@/plugin-sentient/src/constants/abi';

const CreateMarketForm = () => {
  const [mounted, setMounted] = useState(false);
  const { isConnected, address } = useAccount();
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    endDate: '',
    initialLiquidity: '10',
    protocolFee: '1',
    outcomeDescriptions: ['Yes', 'No']
  });

  const { writeContract, isPending, isError, isSuccess, error } = useWriteContract();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert endDate to timestamp in seconds
      const endDate = new Date(formData.endDate);
      endDate.setHours(23, 59, 59, 0);
      const endTimeSeconds = BigInt(Math.floor(endDate.getTime() / 1000));
      
      // Factory address would come from environment or config
      const factoryAddress = "0x1234567890123456789012345678901234567890"; // Replace with actual factory address
      
      writeContract({
        address: factoryAddress as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'createMarket',
        args: [
          formData.question,
          endTimeSeconds,
          "0xf8865d1d66451518fb9117cb1d0e4b0811a42823", // MODE token address
          parseUnits(formData.initialLiquidity, 18),
          BigInt(formData.protocolFee),
          formData.outcomeDescriptions,
        ],
      });
    } catch (error) {
      console.error('Error creating market:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen p-6">
        <Card className="w-full max-w-xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Create New Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate minimum date (today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="min-h-screen p-6">
      <Card className="w-full max-w-xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl border border-indigo-500/20">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full"></div>
          <div className="relative z-10">
            <CardTitle className="text-2xl font-bold text-white">Create New Market</CardTitle>
            <p className="text-sm text-gray-400 mt-2">Create a new prediction market on the Mode Network</p>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Brain className="h-12 w-12 text-indigo-400/50" />
              <p className="text-center text-indigo-300">
                Please connect your wallet to create a new market
              </p>
              <ConnectButton />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-indigo-300">Market Question</Label>
                <Input
                  id="question"
                  name="question"
                  type="text"
                  required
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="Will ETH reach $3000 by end of Q1 2024?"
                  className="w-full bg-gray-800/50 border-indigo-500/20 text-indigo-300 placeholder:text-indigo-300/50 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-indigo-300">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide additional details about this market..."
                  className="w-full bg-gray-800/50 border-indigo-500/20 text-indigo-300 placeholder:text-indigo-300/50 focus:border-indigo-500"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-indigo-300">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    min={minDate}
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full pl-10 bg-gray-800/50 border-indigo-500/20 text-indigo-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialLiquidity" className="text-indigo-300">Initial Liquidity (MODE)</Label>
                  <Input
                    id="initialLiquidity"
                    name="initialLiquidity"
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    value={formData.initialLiquidity}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border-indigo-500/20 text-indigo-300 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protocolFee" className="text-indigo-300">Protocol Fee (%)</Label>
                  <Select 
                    value={formData.protocolFee} 
                    onValueChange={(value) => handleSelectChange(value, 'protocolFee')}
                  >
                    <SelectTrigger className="w-full bg-gray-800/50 border-indigo-500/20 text-indigo-300 focus:border-indigo-500">
                      <SelectValue placeholder="Select fee percentage" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-indigo-500/20">
                      <SelectItem value="0.5">0.5%</SelectItem>
                      <SelectItem value="1">1%</SelectItem>
                      <SelectItem value="2">2%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Market...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Create Market
                  </>
                )}
              </Button>
            </form>
          )}

          {isError && (
            <Alert className="mt-4 bg-red-500/10 border-red-500/20">
              <AlertDescription className="text-red-300">
                Error creating market: {error?.message || "Unknown error occurred"}
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert className="mt-4 bg-indigo-500/10 border-indigo-500/20">
              <AlertDescription className="text-indigo-300">
                Market created successfully! You can now view it in the markets list.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMarketForm;