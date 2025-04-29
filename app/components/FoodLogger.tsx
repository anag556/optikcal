"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ImagePlus, Camera, Loader2 } from 'lucide-react';

interface FoodLogData {
  date: Date;
  calories: number;
  description: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

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

export function FoodLogger({ onLogFood }: { onLogFood: (log: FoodLogData) => void }) {
  const [calories, setCalories] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const file = e.target.files[0];
    setPreviewUrl(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to analyze image');
      
      const data = await response.json();
      setAnalyzedData(data);
      // Update local state with analyzed data
      setCalories(data.calories);
      setDescription(data.description);
      setMacros(data.macros);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogFood = useCallback(async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const foodData = {
        date: new Date(),
        calories: calories,
        description: description,
        macros: macros
      };
      
      await onLogFood(foodData);

      // Reset form
      setCalories(0);
      setDescription('');
      setMacros({ protein: 0, carbs: 0, fat: 0, fiber: 0 });
      setPreviewUrl('');
      setAnalyzedData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsSubmitting(false);
    }
  }, [calories, description, macros, onLogFood, isSubmitting]);

  const handleMacroChange = (macro: keyof typeof macros, value: string) => {
    const newValue = Number(value) || 0;
    setMacros(prev => ({
      ...prev,
      [macro]: newValue
    }));
  };

  return (
    <Card className="p-4 w-full max-w-md mx-auto lg:max-w-none">
      <div className="space-y-4">
        <div>
          <Label htmlFor="food-image" className="block mb-2">Meal Image</Label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="food-image"
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-12 text-sm"
            >
              <ImagePlus className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Upload Image</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 px-4 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Take Photo"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {previewUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={previewUrl}
              alt="Food preview"
              className="object-contain w-full h-full"
            />
          </div>
        )}
        
        {loading && (
          <div className="flex items-center justify-center py-2 text-sm">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Analyzing image...</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="calories" className="block">Calories</Label>
          <Input
            id="calories"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter calories"
            value={calories || ''}
            onChange={(e) => setCalories(Number(e.target.value))}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="block">Description</Label>
          <Input
            id="description"
            placeholder="Enter food description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="block">Macros (grams)</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="protein" className="text-sm">Protein</Label>
              <Input
                id="protein"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0g"
                value={macros.protein || ''}
                onChange={(e) => handleMacroChange('protein', e.target.value)}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="carbs" className="text-sm">Carbs</Label>
              <Input
                id="carbs"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0g"
                value={macros.carbs || ''}
                onChange={(e) => handleMacroChange('carbs', e.target.value)}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="fat" className="text-sm">Fat</Label>
              <Input
                id="fat"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0g"
                value={macros.fat || ''}
                onChange={(e) => handleMacroChange('fat', e.target.value)}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="fiber" className="text-sm">Fiber</Label>
              <Input
                id="fiber"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0g"
                value={macros.fiber || ''}
                onChange={(e) => handleMacroChange('fiber', e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        </div>

        <Button 
          type="button"
          onClick={handleLogFood}
          disabled={(!calories || !description) || isSubmitting}
          className="w-full h-12 text-base font-medium"
        >
          {isSubmitting ? 'Logging...' : 'Log Meal'}
        </Button>
      </div>
    </Card>
  );
}