"use client";

import Button from "@/app/components/Button";
import Title from "@/app/components/Title";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkoutExercise } from "@/app/lib/types";
import useWorkouts from "@/app/hooks/useWorkout";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/app/lib/SupbaseClient";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Workouts() {
  const { user } = useUser();
  const { workouts, loading, refetch } = useWorkouts(user?.id || "");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (e: React.MouseEvent, workoutId: number) => {
    e.stopPropagation();
    if (!confirm("Delete this workout? This action cannot be undone.")) return;

    setDeletingId(workoutId);
    try {
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId);
      if (error) throw error;
      toast.success("Workout deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout");
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CHEST: "bg-red-500/15 text-red-400 border-red-500/20",
      BACK: "bg-blue-500/15 text-blue-400 border-blue-500/20",
      LEGS: "bg-violet-500/15 text-violet-400 border-violet-500/20",
      SHOULDERS: "bg-amber-500/15 text-amber-400 border-amber-500/20",
      ARMS: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      ABS: "bg-pink-500/15 text-pink-400 border-pink-500/20",
    };
    return colors[category] || "bg-slate-500/15 text-slate-400 border-slate-500/20";
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

      {/* Empty state */}
      {!loading && workouts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center text-4xl mb-5 animate-float">
            💪
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            No workouts yet
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mb-6">
            Start your fitness journey by creating your first workout session.
          </p>
          <Link href="../createWorkout">
            <Button px="6" py="3">
              Create First Workout
            </Button>
          </Link>
        </div>
      )}

      {/* Workout cards */}
      {!loading && workouts.length > 0 && (
        <section className="space-y-4 stagger-children">
          {workouts.map((workout) => {
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
                onClick={() => router.push(`/pages/edit/${workout.id}`)}
                className={`glass-card p-5 cursor-pointer gradient-border pl-7 ${deletingId === workout.id ? "opacity-50 pointer-events-none" : ""
                  }`}
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