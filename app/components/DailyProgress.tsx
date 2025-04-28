import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DailyProgressProps {
  dailyCalorieTarget: number;
  currentCalories: number;
  macroTargets: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  currentMacros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

export default function DailyProgress({ 
  dailyCalorieTarget, 
  currentCalories,
  macroTargets,
  currentMacros 
}: DailyProgressProps) {
  const calorieProgress = Math.min(Math.round((currentCalories / dailyCalorieTarget) * 100), 100);
  
  const getMacroProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Calories</span>
            <span>{currentCalories} / {dailyCalorieTarget} kcal</span>
          </div>
          <Progress value={calorieProgress} />
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Protein</span>
            <span>{currentMacros.protein}g / {macroTargets.protein}g</span>
          </div>
          <Progress value={getMacroProgress(currentMacros.protein, macroTargets.protein)} className="bg-blue-200 [&>div]:bg-blue-500" />
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Carbs</span>
            <span>{currentMacros.carbs}g / {macroTargets.carbs}g</span>
          </div>
          <Progress value={getMacroProgress(currentMacros.carbs, macroTargets.carbs)} className="bg-green-200 [&>div]:bg-green-500" />
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Fats</span>
            <span>{currentMacros.fats}g / {macroTargets.fats}g</span>
          </div>
          <Progress value={getMacroProgress(currentMacros.fats, macroTargets.fats)} className="bg-yellow-200 [&>div]:bg-yellow-500" />
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Fiber</span>
            <span>{currentMacros.fiber}g / {macroTargets.fiber}g</span>
          </div>
          <Progress value={getMacroProgress(currentMacros.fiber, macroTargets.fiber)} className="bg-purple-200 [&>div]:bg-purple-500" />
        </div>
      </CardContent>
    </Card>
  );
}