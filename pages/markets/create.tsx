'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

export default function CreateMarketPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    description: '',
    category: '',
    endDate: '',
    endTime: '',
    collateralToken: 'DAI',
    initialLiquidity: '100'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet to create a market');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form
      if (!formData.question || !formData.description || !formData.category || !formData.endDate || !formData.endTime) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate end date is in the future
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      if (endDateTime <= new Date()) {
        throw new Error('End date must be in the future');
      }
      
      // In a real implementation, this would call your API or smart contract
      console.log('Creating market with data:', {
        ...formData,
        endDateTime
      });
      
      // Mock successful creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to markets page
      router.push('/markets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create market');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create a New Market</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Market Details</CardTitle>
            <CardDescription>
              Create a new prediction market for others to trade on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                name="question"
                placeholder="Will X happen by Y date?"
                value={formData.question}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                The question should have a clear YES/NO resolution
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide detailed information about the market resolution criteria..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Include specific resolution criteria and any relevant information
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Crypto">Crypto</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Politics">Politics</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collateralToken">Collateral Token</Label>
                <Select
                  value={formData.collateralToken}
                  onValueChange={(value) => handleSelectChange('collateralToken', value)}
                >
                  <SelectTrigger id="collateralToken">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAI">DAI</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialLiquidity">Initial Liquidity</Label>
                <Input
                  id="initialLiquidity"
                  name="initialLiquidity"
                  type="number"
                  min="10"
                  step="1"
                  value={formData.initialLiquidity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/markets')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? 'Creating...' : 'Create Market'}
            </Button>
          </CardFooter>
        </Card>
      </form>
      
      {!isConnected && (
        <div className="mt-4 p-4 bg-muted rounded-md text-center">
          <p className="text-sm text-muted-foreground">
            Please connect your wallet to create a market
          </p>
        </div>
      )}
    </div>
  );
} 