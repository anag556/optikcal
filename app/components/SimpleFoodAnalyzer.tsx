"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImagePlus, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AnalyzedData {
  calories: number;
  description: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export function SimpleFoodAnalyzer() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setLoading(true);
    setError(null);
    const file = e.target.files[0];
    setPreviewUrl(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Use the public endpoint that doesn't require authentication
      const response = await fetch('/api/public-analyze-food', {
        method: 'POST',
        body: formData,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API error response:', responseData);
        throw new Error(responseData.error || 'Failed to analyze image');
      }
      
      // Check if the response has the expected structure
      if (!responseData.calories || !responseData.description || !responseData.macros) {
        console.error('Invalid response format:', responseData);
        throw new Error('Invalid response format from analysis API');
      }
      
      setAnalyzedData(responseData);
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      setError(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setPreviewUrl('');
    setAnalyzedData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Free Food Analyzer</h2>
          <p className="text-muted-foreground text-sm">
            Upload a photo of your meal to get an instant nutritional breakdown.
            <br />
            <span className="text-xs font-medium">Register to save your food logs!</span>
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="food-image"
          />
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 h-12"
            disabled={loading}
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <Button 
            variant="outline" 
            className="h-12 px-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            aria-label="Take Photo"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            <span>Analyzing your meal...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md text-center">
            <p>{error}</p>
            <p className="text-sm mt-1">
              {error.includes('Failed to analyze') && "Our AI might be having trouble identifying the food in this image."}
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetAnalysis}
              >
                Try Again
              </Button>
              <Button 
                variant="default"
                size="sm"
                asChild
              >
                <Link href="/signup">Sign Up for Full Features</Link>
              </Button>
            </div>
          </div>
        )}

        {previewUrl && !loading && !error && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={previewUrl}
              alt="Food preview"
              className="object-contain w-full h-full"
            />
          </div>
        )}
        
        {analyzedData && !loading && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">{analyzedData.description}</h3>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Total Calories</span>
                <span className="text-2xl font-bold">{analyzedData.calories} kcal</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground mb-1">Protein</div>
                  <div className="font-medium">{analyzedData.macros.protein}g</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground mb-1">Carbs</div>
                  <div className="font-medium">{analyzedData.macros.carbs}g</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground mb-1">Fat</div>
                  <div className="font-medium">{analyzedData.macros.fat}g</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xs text-muted-foreground mb-1">Fiber</div>
                  <div className="font-medium">{analyzedData.macros.fiber}g</div>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetAnalysis}
                className="mr-2"
              >
                Analyze Another
              </Button>
              <Button 
                variant="default"
                size="sm"
                asChild
              >
                <Link href="/signup">Sign Up to Save</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}