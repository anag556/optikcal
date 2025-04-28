"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Pencil, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FoodLog {
  _id?: string;
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

interface FoodHistoryProps {
  logs: FoodLog[];
  onUpdate?: (log: FoodLog) => Promise<void>;
}

export function FoodHistory({ logs, onUpdate }: FoodHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localLogs, setLocalLogs] = useState<FoodLog[]>(logs);

  // Update local logs when props change
  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleEditLog = async (log: FoodLog) => {
    if (!log._id) return;
    
    try {
      const response = await fetch(`/api/food-logs?id=${log._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });

      if (!response.ok) throw new Error('Failed to update food log');
      
      const updatedLog = await response.json();
      
      // Update local state immediately
      setLocalLogs(prev => prev.map(l => l._id === updatedLog._id ? updatedLog : l));
      
      // Notify parent component
      if (onUpdate) {
        await onUpdate(updatedLog);
      }
      
      setIsEditing(false);
      setEditingLog(null);
    } catch (error) {
      console.error('Error updating food log:', error);
    }
  };

  const handleDeleteLog = async (log: FoodLog) => {
    if (!log._id) return;
    
    try {
      const response = await fetch(`/api/food-logs?id=${log._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete food log');
      
      // Update local state immediately
      setLocalLogs(prev => prev.filter(l => l._id !== log._id));
      
      // Notify parent component
      if (onUpdate) {
        await onUpdate(log);
      }
    } catch (error) {
      console.error('Error deleting food log:', error);
    }
  };

  const selectedDayLogs = localLogs.filter(log => {
    const logDate = new Date(log.date);
    const start = startOfDay(selectedDate);
    const end = endOfDay(selectedDate);
    return logDate >= start && logDate <= end;
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
        <CardTitle>Meal History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              <Button variant="outline" size="icon" onClick={handleNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="bg-secondary/20 px-2 py-1 rounded-full">
                {totalCalories} calories
              </span>
              <span className="bg-secondary/20 px-2 py-1 rounded-full">
                P: {totalMacros.protein}g
              </span>
              <span className="bg-secondary/20 px-2 py-1 rounded-full">
                C: {totalMacros.carbs}g
              </span>
              <span className="bg-secondary/20 px-2 py-1 rounded-full">
                F: {totalMacros.fat}g
              </span>
              <span className="bg-secondary/20 px-2 py-1 rounded-full">
                Fr: {totalMacros.fiber}g
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[400px] p-4 sm:p-6">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {selectedDayLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 rounded-lg border bg-muted/5 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm sm:text-base">
                          {log.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs whitespace-nowrap text-muted-foreground">
                            {format(new Date(log.date), 'h:mm a')}
                          </p>
                          <div className="flex items-center gap-2">
                            <Sheet open={isEditing && editingLog?._id === log._id} onOpenChange={(open) => {
                              setIsEditing(open);
                              if (open) setEditingLog(log);
                              else setEditingLog(null);
                            }}>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent title=''>
                                <SheetHeader>
                                  <SheetTitle>Edit Food Log</SheetTitle>
                                  <SheetDescription>
                                    Make changes to your food log entry.
                                  </SheetDescription>
                                </SheetHeader>
                                {editingLog && (
                                  <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-description">Description</Label>
                                      <Input
                                        id="edit-description"
                                        value={editingLog.description}
                                        onChange={(e) => setEditingLog({
                                          ...editingLog,
                                          description: e.target.value
                                        })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-calories">Calories</Label>
                                      <Input
                                        id="edit-calories"
                                        type="number"
                                        value={editingLog.calories}
                                        onChange={(e) => setEditingLog({
                                          ...editingLog,
                                          calories: Number(e.target.value)
                                        })}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-protein">Protein (g)</Label>
                                        <Input
                                          id="edit-protein"
                                          type="number"
                                          value={editingLog.macros.protein}
                                          onChange={(e) => setEditingLog({
                                            ...editingLog,
                                            macros: {
                                              ...editingLog.macros,
                                              protein: Number(e.target.value)
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-carbs">Carbs (g)</Label>
                                        <Input
                                          id="edit-carbs"
                                          type="number"
                                          value={editingLog.macros.carbs}
                                          onChange={(e) => setEditingLog({
                                            ...editingLog,
                                            macros: {
                                              ...editingLog.macros,
                                              carbs: Number(e.target.value)
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-fat">Fat (g)</Label>
                                        <Input
                                          id="edit-fat"
                                          type="number"
                                          value={editingLog.macros.fat}
                                          onChange={(e) => setEditingLog({
                                            ...editingLog,
                                            macros: {
                                              ...editingLog.macros,
                                              fat: Number(e.target.value)
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-fiber">Fiber (g)</Label>
                                        <Input
                                          id="edit-fiber"
                                          type="number"
                                          value={editingLog.macros.fiber}
                                          onChange={(e) => setEditingLog({
                                            ...editingLog,
                                            macros: {
                                              ...editingLog.macros,
                                              fiber: Number(e.target.value)
                                            }
                                          })}
                                        />
                                      </div>
                                    </div>
                                    <Button 
                                      className="w-full mt-6"
                                      onClick={() => editingLog && handleEditLog(editingLog)}
                                    >
                                      Save Changes
                                    </Button>
                                  </div>
                                )}
                              </SheetContent>
                            </Sheet>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteLog(log)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium">{log.calories} cal</span>
                        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                          <span className="bg-secondary/20 px-1.5 py-0.5 rounded">P: {log.macros?.protein || 0}g</span>
                          <span className="bg-secondary/20 px-1.5 py-0.5 rounded">C: {log.macros?.carbs || 0}g</span>
                          <span className="bg-secondary/20 px-1.5 py-0.5 rounded">F: {log.macros?.fat || 0}g</span>
                          <span className="bg-secondary/20 px-1.5 py-0.5 rounded">Fiber: {log.macros?.fiber || 0}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedDayLogs.length === 0 && (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-sm text-muted-foreground">
                      No food logged for {format(selectedDate, 'MMMM d')}
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