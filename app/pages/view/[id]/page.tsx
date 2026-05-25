"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Workout, Set } from "@/app/lib/types";
import { useSupabase } from "@/app/lib/SupbaseClient";
import Title from "@/app/components/Title";
import { WorkoutExerciseWithDbId } from "@/app/lib/types";
import { categoryColors } from "@/app/constants/categories";

function ViewPage() {
  const supabase = useSupabase();
  const [workout, setWorkout] = useState<(Workout & { exercises: WorkoutExerciseWithDbId[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("workouts")
        .select(`id, title, date, user_id, workouts_exercises ( id, exercise_id, exercise:exercise!exercise_id ( id, name, category, user_id ), sets ( id, reps, weight ) )`)
        .eq("id", Number(params.id))
        .single();
      if (error || !data) { setLoading(false); return; }
      
      const wes = (data.workouts_exercises || []).map((we: any) => {
        const exData = Array.isArray(we.exercise) ? we.exercise[0] : we.exercise;
        const ex = exData as Record<string, unknown> | null;
        return {
          exerciseId: we.exercise_id as number,
          workoutExerciseId: we.id as number,
          exercise: ex ? { id: ex.id as number, user_id: ex.user_id as string, name: ex.name as string, category: ex.category as string } : null,
          sets: (we.sets || []).map((s: any) => ({ id: s.id, reps: s.reps, weight: s.weight })),
        };
      });
      setWorkout({ id: data.id, title: data.title, date: data.date, user_id: data.user_id, exercises: wes });
      setLoading(false);
    };
    if (params.id) load();
  }, [params.id, supabase]);

  if (loading) return (
    <div className="min-h-screen max-w-2xl mx-auto p-4">
      <div className="glass-card p-6 mt-4">
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-4 w-32 mb-8" />
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 w-full mt-4" />)}
      </div>
    </div>
  );

  if (!workout) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-slate-300 mb-2">Workout not found</h2>
        <button onClick={() => router.back()} className="px-6 py-3 mt-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">Go Back</button>
      </div>
    </div>
  );

  const totalVolume = workout.exercises.reduce((acc, ex) => acc + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-4 animate-fade-in pb-24">
      {/* Header */}
      <section className="flex items-center gap-4 mt-2 mb-6">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm border border-slate-700/50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <Title size="text-2xl">{workout.title}</Title>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date(workout.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Exercises</p>
          <p className="text-white font-bold text-xl">{workout.exercises.length}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Sets</p>
          <p className="text-white font-bold text-xl">{totalSets}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Volume</p>
          <p className="text-emerald-400 font-bold text-xl">{totalVolume.toLocaleString()}</p>
          <p className="text-slate-600 text-[10px]">kg</p>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white mb-2">Workout Details</h3>
        {workout.exercises.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-500">No exercises logged for this workout.</div>
        ) : (
          workout.exercises.map(w => (
            <div key={w.exerciseId} className="glass-card p-5 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-500" />
                <h3 className="font-bold text-white text-lg">{w.exercise?.name}</h3>
                <span className={`text-xs ${categoryColors[w.exercise?.category ?? "default"]} bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50 ml-auto`}>
                  {w.exercise?.category ?? "Unknown"}
                </span>
              </div>
              
              <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-800/50 uppercase">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium text-center w-16">Set</th>
                      <th scope="col" className="px-4 py-3 font-medium text-center">Weight <span className="text-[10px] lowercase text-slate-600">kg</span></th>
                      <th scope="col" className="px-4 py-3 font-medium text-center">Reps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {w.sets.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-center text-slate-500 text-xs">No sets recorded</td>
                      </tr>
                    ) : w.sets.map((set, index) => (
                      <tr key={set.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-400 text-center">{index + 1}</td>
                        <td className="px-4 py-3 text-emerald-400 font-semibold text-center">{set.weight}</td>
                        <td className="px-4 py-3 text-white font-semibold text-center">{set.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewPage;
