import { useEffect, useState, useCallback } from "react";
import { PersonalRecord, WorkoutStats } from "../lib/types";
import { supabase } from "../lib/SupbaseClient";
import { categories } from "../constants/categories";

const useProgress = (userId: string) => {
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalSets: 0,
    totalVolume: 0,
    totalExercises: 0,
    avgSetsPerWorkout: 0,
    avgVolumePerWorkout: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState<
    { id: number; title: string; date: string; exerciseCount: number; setCount: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("workouts")
        .select(`
          id,
          title,
          date,
          workouts_exercises (
            id,
            exercise_id,
            exercise:exercise!exercise_id (
              id,
              name,
              category
            ),
            sets (
              id,
              reps,
              weight
            )
          )
        `)
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching progress data", error);
        return;
      }

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      // Compute PRs per category
      const prMap: Record<string, PersonalRecord> = {};

      let totalSets = 0;
      let totalVolume = 0;
      const exerciseSet = new Set<number>();

      for (const workout of data) {
        for (const we of workout.workouts_exercises || []) {
          const exercise = we.exercise as Record<string, unknown> | null;
          if (!exercise) continue;

          const category = exercise.category as string;
          const exerciseName = exercise.name as string;
          exerciseSet.add(we.exercise_id);

          for (const s of (we.sets as Array<Record<string, unknown>>) || []) {
            const weight = s.weight as number;
            const reps = s.reps as number;
            totalSets++;
            totalVolume += weight * reps;

            // Check if this is a PR for this category (highest weight)
            if (
              categories.includes(category) &&
              (!prMap[category] || weight > prMap[category].weight)
            ) {
              prMap[category] = {
                exerciseName,
                category,
                weight,
                reps,
                date: workout.date,
              };
            }
          }
        }
      }

      setPrs(
        categories
          .filter((cat) => prMap[cat])
          .map((cat) => prMap[cat])
      );

      setStats({
        totalWorkouts: data.length,
        totalSets,
        totalVolume,
        totalExercises: exerciseSet.size,
        avgSetsPerWorkout: data.length > 0 ? Math.round(totalSets / data.length) : 0,
        avgVolumePerWorkout: data.length > 0 ? Math.round(totalVolume / data.length) : 0,
      });

      // Recent workouts (last 5)
      setRecentWorkouts(
        data.slice(0, 5).map((w) => ({
          id: w.id,
          title: w.title,
          date: w.date,
          exerciseCount: w.workouts_exercises?.length || 0,
          setCount:
            w.workouts_exercises?.reduce(
              (acc: number, we: Record<string, unknown>) =>
                acc + ((we.sets as Array<unknown>)?.length || 0),
              0
            ) || 0,
        }))
      );
    } catch (error) {
      console.error("Error computing progress", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { prs, stats, recentWorkouts, loading };
};

export default useProgress;
