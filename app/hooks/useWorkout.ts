import { supabase } from "../lib/SupbaseClient";
import { Workout } from "../lib/types";
import { useEffect, useState, useCallback } from "react";

const useWorkouts = (userId: string) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("workouts")
        .select(`
          id,
          title,
          date,
          user_id,
          workouts_exercises (
            id,
            exercise_id,
            exercise:exercise!exercise_id (
              id,
              name,
              category,
              user_id
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
        console.log("Error fetching workouts", error);
        return;
      }

      setWorkouts(
        data?.map((w) => ({
          id: w.id,
          title: w.title,
          date: w.date,
          user_id: w.user_id,
          exercises:
            w.workouts_exercises?.map((we: Record<string, unknown>) => {
              const exData = Array.isArray(we.exercise) ? we.exercise[0] : we.exercise;
              const ex = exData as Record<string, unknown> | null;
              return {
                exerciseId: we.exercise_id as number,
                exercise: ex
                  ? {
                      id: ex.id as number,
                      user_id: ex.user_id as string,
                      name: ex.name as string,
                      category: ex.category as string,
                    }
                  : null,
                sets:
                  (we.sets as Array<Record<string, unknown>>)?.map((s) => ({
                    id: s.id as number,
                    reps: s.reps as number,
                    weight: s.weight as number,
                  })) ?? [],
              };
            }) ?? [],
        })) ?? []
      );
    } catch (error) {
      console.log("Error fetching workouts", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { workouts, loading, refetch: fetchData };
};

export default useWorkouts;
