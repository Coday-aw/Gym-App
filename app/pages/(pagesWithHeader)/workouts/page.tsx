"use client";

import Button from "@/app/components/Button";
import Title from "@/app/components/Title";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkoutExercise } from "@/app/lib/types";
import useWorkouts from "@/app/hooks/useWorkout";
import { useUser } from "@clerk/nextjs";
import { useSupabase } from "@/app/lib/SupbaseClient";
import { useState } from "react";
import toast from "react-hot-toast";
import { getCategoryColor } from "@/app/constants/categories";

export default function Workouts() {
  const supabase = useSupabase();
  const { user } = useUser();
  const { workouts, loading, refetch } = useWorkouts(user?.id || "");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const todayStr = new Date().toISOString().split("T")[0];
  const filteredWorkouts = [...workouts].sort((b, a) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((workout) => {
      if (activeTab === "upcoming") {
        return workout.date >= todayStr;
      } else {
        return workout.date < todayStr;
      }
    });

  const handleDelete = async (e: React.MouseEvent, workoutId: number) => {

    // step 1: stop propagation
    e.stopPropagation();

    // step 2: confirm deletion
    if (!confirm("Delete this workout? This action cannot be undone.")) return;

    setDeletingId(workoutId);

    // step 3: delete from sets table 
    try {
      const { data: workoutExercises, error: fetchError } = await supabase
        .from("workouts_exercises")
        .select("id")
        .eq("workout_id", workoutId);

      if (fetchError) throw fetchError;

      if (workoutExercises && workoutExercises.length > 0) {
        const exerciseIds = workoutExercises.map(we => we.id);
        const { error } = await supabase
          .from("sets")
          .delete()
          .in("workout_exercise_id", exerciseIds);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error deleting sets:", error);
    }

    // step 4: delete from workouts_exercises table
    try {
      const { error } = await supabase
        .from("workouts_exercises")
        .delete()
        .eq("workout_id", workoutId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting workouts_exercises:", error);
    }

    // step 5: delete from workouts table
    try {
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId);
      if (error) throw error;

      // step 6: refetch
      refetch();

      // step 7: show success message
      toast.success("Workout deleted successfully");

    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout");
    } finally {
      // step 8: stop loading
      setDeletingId(null);
    }
  };



  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <section className="flex justify-between items-center mt-6 mb-6">
        <div>
          <Title size="text-2xl">Workouts</Title>
          <p className="text-slate-500 text-sm mt-1">
            {workouts.length} session{workouts.length !== 1 ? "s" : ""} logged
          </p>
        </div>
        <Link href="createWorkout">
          <Button width="25" px="3" py="4">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </Button>
        </Link>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-5 w-40 mb-3" />
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      {!loading && workouts.length > 0 && (
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-xl w-full max-w-sm mx-auto">
          <button
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "upcoming"
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Workouts
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "past"
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            onClick={() => setActiveTab("past")}
          >
            Past Workouts
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredWorkouts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center text-4xl mb-5 animate-float">
            💪
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            {workouts.length === 0 ? "No workouts yet" : `No ${activeTab} workouts`}
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mb-6">
            {workouts.length === 0
              ? "Start your fitness journey by creating your first workout session."
              : activeTab === "upcoming"
                ? "You have no upcoming workouts scheduled."
                : "You don't have any completed workouts yet."}
          </p>
          {workouts.length === 0 && (
            <Link href="/pages/createWorkout">
              <Button px="6" py="3">
                Create First Workout
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Workout cards */}
      {!loading && filteredWorkouts.length > 0 && (
        <section className="space-y-4 stagger-children">
          {filteredWorkouts.map((workout) => {
            const totalSets = workout.exercises.reduce(
              (acc: number, ex: WorkoutExercise) => acc + ex.sets.length,
              0
            );
            const totalVolume = workout.exercises.reduce(
              (acc, ex) =>
                acc + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
              0
            );

            return (
              <div
                key={workout.id}
                onClick={() => {
                  if (activeTab === "upcoming") {
                    router.push(`/pages/edit/${workout.id}`);
                  } else {
                    router.push(`/pages/view/${workout.id}`);
                  }
                }}
                className={`glass-card p-5 gradient-border pl-7 transition-all ${deletingId === workout.id ? "opacity-50 pointer-events-none" : ""} cursor-pointer hover:bg-slate-800/60`}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {workout.title}
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(workout.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, workout.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    aria-label="Delete workout"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Exercise tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {workout.exercises.map((ex) => (
                    <span
                      key={ex.exerciseId}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryColor(
                        ex.exercise?.category || ""
                      )}`}
                    >
                      {ex.exercise ? ex.exercise.name : "Unknown"}
                    </span>
                  ))}
                </div>

                {/* Stats footer */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/30">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    {workout.exercises.length} exercises
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {totalSets} sets
                  </div>
                  {totalVolume > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium ml-auto">
                      {totalVolume.toLocaleString()} kg vol.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}