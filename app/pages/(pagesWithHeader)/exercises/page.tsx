"use client";
import Button from "@/app/components/Button";
import React, { useState } from "react";
import { supabase } from "@/app/lib/SupbaseClient";
import useExercises from "@/app/hooks/useExercise";
import { useUser } from "@clerk/nextjs";
import Title from "@/app/components/Title";
import toast, { Toaster } from "react-hot-toast";
import { categories } from "@/app/constants/categories";




const categoryIcons: Record<string, string> = {
  CHEST: "🫁",
  BACK: "🔙",
  LEGS: "🦵",
  SHOULDERS: "💪",
  ARMS: "🦾",
  ABS: "🧱",
};

const categoryColors: Record<string, string> = {
  CHEST: "from-red-500/20 to-red-600/10 border-red-500/20",
  BACK: "from-blue-500/20 to-blue-600/10 border-blue-500/20",
  LEGS: "from-violet-500/20 to-violet-600/10 border-violet-500/20",
  SHOULDERS: "from-amber-500/20 to-amber-600/10 border-amber-500/20",
  ARMS: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20",
  ABS: "from-pink-500/20 to-pink-600/10 border-pink-500/20",
};

const categoryTextColors: Record<string, string> = {
  CHEST: "text-red-400",
  BACK: "text-blue-400",
  LEGS: "text-violet-400",
  SHOULDERS: "text-amber-400",
  ARMS: "text-emerald-400",
  ABS: "text-pink-400",
};

export default function Exercises() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useUser();
  const { exercises, refresh } = useExercises(user?.id || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const exerciseName = formData.get("exerciseName") as string;
    const category = selectedCategory;
    if (!exerciseName || !category) return;

    try {
      const { error } = await supabase
        .from("exercise")
        .insert([{ name: exerciseName, category, user_id: user?.id || "" }])
        .select();
      if (error) console.error("Error adding exercise:", error);
      setModalOpen(false);
      setSelectedCategory(null);
      await refresh();
      toast.success("New exercise added successfully!");
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  const handleDelete = async (exerciseId: number) => {
    const { error } = await supabase.from("exercise").delete().eq("id", exerciseId);
    await refresh();
    if (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Exercise is used in a workout and cannot be deleted at the moment!");
    } else {
      toast.success("Exercise deleted sucessfully!");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <Toaster position="top-center" />
      <section className="flex items-center justify-between mt-6 mb-6">
        <div>
          <Title size="text-2xl">Exercises</Title>
          <p className="text-slate-500 text-sm mt-1">
            {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} in your library
          </p>
        </div>
        <Button width="18" px="3" py="4" onClick={() => setModalOpen(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </Button>
      </section>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
        {categories.map((category) => {
          const catExercises = exercises.filter((ex) => ex.category === category);
          return (
            <div key={category} className="glass-card overflow-hidden">
              {/* Category header */}
              <div className={`bg-gradient-to-r ${categoryColors[category]} p-4 border-b border-slate-700/30`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[category]}</span>
                  <div>
                    <h2 className={`text-lg font-bold ${categoryTextColors[category]}`}>
                      {category}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {catExercises.length} exercise{catExercises.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Exercise list */}
              <div className="p-3">
                {catExercises.length === 0 ? (
                  <p className="text-slate-600 text-sm text-center py-6">
                    No exercises yet
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {catExercises.map((exercise) => (
                      <li
                        key={exercise.id}
                        className="flex justify-between items-center bg-slate-800/40 rounded-lg px-3 py-2.5 group hover:bg-slate-800/70 transition-all"
                      >
                        <span className="text-slate-200 text-sm font-medium">
                          {exercise.name}
                        </span>
                        <button
                          onClick={() => handleDelete(exercise.id)}
                          className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add exercise modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 p-4 modal-overlay">
          <div className="glass rounded-2xl p-6 shadow-2xl w-full max-w-lg modal-content">
            <div className="flex items-center justify-between mb-5">
              <Title size="text-xl">New Exercise</Title>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all cursor-pointer"
                onClick={() => { setModalOpen(false); setSelectedCategory(null); }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2 block">
                  Exercise Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bench Press"
                  name="exerciseName"
                  className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-3 w-full text-slate-100 text-sm placeholder:text-slate-600"
                />
              </div>

              <div className="mb-6">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory((p) => (p === category ? null : category))}
                      key={category}
                      className={`text-sm font-medium px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedCategory === category
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        }`}
                    >
                      {categoryIcons[category]} {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  width="full"
                  px="4"
                  py="3"
                  onClick={() => { setModalOpen(false); setSelectedCategory(null); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  width="full"
                  px="4"
                  py="3"
                  disabled={!selectedCategory}
                >
                  Add Exercise
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
