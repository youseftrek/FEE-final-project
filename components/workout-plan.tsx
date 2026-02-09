"use client";

import * as React from "react";
import {
  Dumbbell,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: string;
  restTime: string;
  difficulty: string;
  muscleGroups: string[];
  tips: string[];
  equipment: string;
  completed?: boolean;
}

interface WorkoutWeek {
  week: number;
  exercises: Exercise[];
  generatedAt: string;
}

const STORAGE_KEY = "workout-plan";

export function WorkoutPlan() {
  const [currentWeek, setCurrentWeek] = React.useState(1);
  const [weeks, setWeeks] = React.useState<WorkoutWeek[]>([]);
  const [generatingExercises, setGeneratingExercises] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWeeks(parsed.weeks || []);
        setCurrentWeek(parsed.currentWeek || 1);
      } catch (error) {
        console.error("Failed to load workout plan:", error);
      }
    }
  }, []);

  // Save to localStorage whenever weeks change
  React.useEffect(() => {
    if (weeks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ weeks, currentWeek }));
    }
  }, [weeks, currentWeek]);

  const generateExercises = async () => {
    setGeneratingExercises(true);
    try {
      const response = await fetch("/api/generate-exercises", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        const newWeek: WorkoutWeek = {
          week: currentWeek,
          exercises: data.exercises.map((ex: Exercise) => ({
            ...ex,
            completed: false,
          })),
          generatedAt: new Date().toISOString(),
        };

        setWeeks((prev) => {
          const filtered = prev.filter((w) => w.week !== currentWeek);
          return [...filtered, newWeek].sort((a, b) => a.week - b.week);
        });

        toast.success(`Week ${currentWeek} workout plan generated!`, {
          description: `${data.exercises.length} exercises created.`,
        });
      } else {
        toast.error("Failed to generate exercises", {
          description: data.message,
        });
      }
    } catch (error) {
      toast.error("Failed to generate exercises", {
        description: "Please try again later.",
      });
    } finally {
      setGeneratingExercises(false);
    }
  };

  const toggleExerciseComplete = (weekNum: number, exerciseIndex: number) => {
    setWeeks((prev) =>
      prev.map((week) => {
        if (week.week === weekNum) {
          const updatedExercises = [...week.exercises];
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            completed: !updatedExercises[exerciseIndex].completed,
          };
          return { ...week, exercises: updatedExercises };
        }
        return week;
      }),
    );
  };

  const currentWeekData = weeks.find((w) => w.week === currentWeek);
  const completedCount =
    currentWeekData?.exercises.filter((ex) => ex.completed).length || 0;
  const totalCount = currentWeekData?.exercises.length || 0;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Your Workout Program
              </CardTitle>
              <CardDescription>
                Personalized exercises based on your fitness profile
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => setCurrentWeek((prev) => Math.max(1, prev - 1))}
                variant="outline"
                size="sm"
                disabled={currentWeek === 1}
                className="hidden sm:inline-flex"
              >
                Previous Week
              </Button>
              <Button
                onClick={() => setCurrentWeek((prev) => Math.max(1, prev - 1))}
                variant="outline"
                size="sm"
                disabled={currentWeek === 1}
                className="sm:hidden"
              >
                Prev
              </Button>
              <Badge variant="outline" className="px-4 py-2 text-lg">
                Week {currentWeek}
              </Badge>
              <Button
                onClick={() => setCurrentWeek((prev) => prev + 1)}
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Next Week
              </Button>
              <Button
                onClick={() => setCurrentWeek((prev) => prev + 1)}
                variant="outline"
                size="sm"
                className="sm:hidden"
              >
                Next
              </Button>
            </div>
          </div>

          {currentWeekData && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Progress: {completedCount} of {totalCount} exercises completed
                </span>
                <span className="text-sm font-medium">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-purple-600 to-orange-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Exercises */}
      {currentWeekData ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Week {currentWeek} Exercises
            </h2>
            <Button
              onClick={generateExercises}
              disabled={generatingExercises}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {generatingExercises ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentWeekData.exercises.map((exercise, index) => (
              <Card
                key={index}
                className={cn(
                  "relative overflow-hidden transition-all hover:shadow-md flex flex-col",
                  exercise.completed && "bg-muted/50",
                )}
              >
                {/* Completion Indicator */}
                <div
                  className={cn(
                    "absolute top-0 left-0 w-1 h-full transition-all",
                    exercise.completed
                      ? "bg-gradient-to-b from-green-500 to-emerald-500"
                      : "bg-gradient-to-b from-primary via-purple-600 to-orange-500",
                  )}
                />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg truncate">
                          {exercise.name}
                        </CardTitle>
                        {exercise.completed && (
                          <Badge
                            variant="outline"
                            className="gap-1 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                          >
                            <Check className="h-3 w-3" />
                            Done
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-1">
                        {exercise.muscleGroups.join(" • ")}
                      </CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <p className="text-sm text-muted-foreground">
                      {exercise.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          Sets
                        </span>
                        <span className="font-semibold">{exercise.sets}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                        <Dumbbell className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          Reps
                        </span>
                        <span className="font-semibold text-sm">
                          {exercise.reps}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          Rest
                        </span>
                        <span className="font-semibold text-sm">
                          {exercise.restTime}
                        </span>
                      </div>
                    </div>

                    {/* Equipment */}
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Equipment:</span>
                      <span className="text-sm text-muted-foreground">
                        {exercise.equipment}
                      </span>
                    </div>

                    {/* Tips */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Form Tips
                      </p>
                      <ScrollArea className="h-20">
                        <ul className="space-y-1 pr-4">
                          {exercise.tips.map((tip, tipIndex) => (
                            <li
                              key={tipIndex}
                              className="text-xs text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-primary mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </div>
                  </div>

                  {/* Complete Button - Always at bottom */}
                  <Button
                    onClick={() => toggleExerciseComplete(currentWeek, index)}
                    variant={exercise.completed ? "outline" : "default"}
                    className="w-full gap-2 mt-4"
                  >
                    {exercise.completed ? (
                      <>
                        <Check className="h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>Mark as Complete</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No workout plan for Week {currentWeek}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Generate your personalized exercise routine for this week based on
              your profile.
            </p>
            <Button
              onClick={generateExercises}
              disabled={generatingExercises}
              className="gap-2"
            >
              {generatingExercises ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Week {currentWeek} Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
