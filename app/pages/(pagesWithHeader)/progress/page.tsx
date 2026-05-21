"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import useProgress from "@/app/hooks/useProgress";
import Title from "@/app/components/Title";
import { useRouter } from "next/navigation";
import { categoryColorsAndIcons } from "@/app/constants/categories";


export default function Progress() {
  const { user } = useUser();
  const { prs, stats, recentWorkouts, loading } = useProgress(user?.id || "");
  const router = useRouter();

  if (loading) {
    return (
      <div className="animate-fade-in mt-6">
        <div className="skeleton h-8 w-40 mb-6" />
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
        <div className="skeleton h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mt-6">
      <div className="mb-8">
        <Title size="text-2xl">Progress</Title>
        <p className="text-slate-500 text-sm mt-1">Track your personal records and stats</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 mb-10 stagger-children">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-lg">🏋️</div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
              <p className="text-xs text-slate-500">Workouts</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-lg">📊</div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalSets}</p>
              <p className="text-xs text-slate-500">Total Sets</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-lg">⚡</div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalVolume.toLocaleString()}<span className="text-sm text-slate-500 ml-0.5">kg</span></p>
              <p className="text-xs text-slate-500">Total Volume</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-lg">🎯</div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalExercises}</p>
              <p className="text-xs text-slate-500">Exercises Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Averages bar */}
      {stats.totalWorkouts > 0 && (
        <div className="glass-card p-4 mb-10 flex items-center justify-around">
          <div className="text-center">
            <p className="text-lg font-bold gradient-text">{stats.avgSetsPerWorkout}</p>
            <p className="text-xs text-slate-500">Avg Sets/Workout</p>
          </div>
          <div className="w-px h-8 bg-slate-700/50" />
          <div className="text-center">
            <p className="text-lg font-bold gradient-text">{stats.avgVolumePerWorkout.toLocaleString()}<span className="text-xs text-slate-500 ml-0.5">kg</span></p>
            <p className="text-xs text-slate-500">Avg Vol/Workout</p>
          </div>
        </div>
      )}

      {/* Personal Records */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-2xl">🏆</span>
          <Title size="text-xl">Personal Records</Title>
        </div>

        {prs.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-3 animate-float">🏅</div>
            <h3 className="text-slate-300 font-semibold mb-1">No PRs yet</h3>
            <p className="text-slate-500 text-sm">Start logging workouts to track your personal records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {prs.map((pr) => {
              const colors = categoryColorsAndIcons[pr.category] || categoryColorsAndIcons.CHEST;
              return (
                <div
                  key={pr.category}
                  className={`glass-card overflow-hidden`}
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-r ${colors.bg} p-3 border-b ${colors.border}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{colors.icon}</span>
                        <span className={`text-sm font-bold ${colors.text}`}>{pr.category}</span>
                      </div>
                      <span className="text-lg">🏆</span>
                    </div>
                  </div>

                  {/* PR details */}
                  <div className="p-4">
                    <h3 className="font-bold text-white text-base mb-2">{pr.exerciseName}</h3>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-3xl font-black gradient-text">{pr.weight}</span>
                      <span className="text-sm text-slate-500 mb-1">kg</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">{pr.reps} reps</span>
                      <span className="text-xs text-slate-600">
                        {new Date(pr.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentWorkouts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">📋</span>
            <Title size="text-xl">Recent Activity</Title>
          </div>

          <div className="space-y-3 stagger-children">
            {recentWorkouts.map((w) => (
              <div
                key={w.id}
                onClick={() => router.push(`/pages/edit/${w.id}`)}
                className="glass-card p-4 gradient-border pl-6 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{w.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(w.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{w.exerciseCount} exercises</p>
                    <p className="text-xs text-emerald-500 font-medium">{w.setCount} sets</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
