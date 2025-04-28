"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface FoodLog {
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

export function FoodHistory({ logs }: { logs: FoodLog[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const selectedDayLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === selectedDate.getFullYear() &&
           logDate.getMonth() === selectedDate.getMonth() &&
           logDate.getDate() === selectedDate.getDate();
  });

  const totalCalories = selectedDayLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalMacros = selectedDayLogs.reduce((sum, log) => ({
    protein: sum.protein + (log.macros?.protein || 0),
    carbs: sum.carbs + (log.macros?.carbs || 0),
    fat: sum.fat + (log.macros?.fat || 0),
    fiber: sum.fiber + (log.macros?.fiber || 0)
  }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="p-4 md:w-[350px] md:border-r">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border w-full"
            />
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-base sm:text-lg font-semibold">
                {format(selectedDate, 'MMM d, yyyy')}
              </h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-secondary px-2 py-1 rounded-full">
                  {totalCalories} cal
                </span>
                <span className="bg-secondary px-2 py-1 rounded-full">
                  P: {totalMacros.protein}g
                </span>
                <span className="bg-secondary px-2 py-1 rounded-full">
                  C: {totalMacros.carbs}g
                </span>
                <span className="bg-secondary px-2 py-1 rounded-full">
                  F: {totalMacros.fat}g
                </span>
              </div>
            </div>
            
            <ScrollArea className="h-[250px] sm:h-[300px] md:h-[400px] rounded-md border">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {selectedDayLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-medium text-sm sm:text-base line-clamp-2">
                        {log.description}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {format(new Date(log.date), 'h:mm a')} - {log.calories} cal
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>P: {log.macros?.protein || 0}g</span>
                        <span>C: {log.macros?.carbs || 0}g</span>
                        <span>F: {log.macros?.fat || 0}g</span>
                        <span>Fiber: {log.macros?.fiber || 0}g</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedDayLogs.length === 0 && (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-sm text-muted-foreground">
                      No food logged for this day
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}