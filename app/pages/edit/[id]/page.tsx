"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Workout, Exercise, Set, SetInsert } from "@/app/lib/types";
import { supabase } from "@/app/lib/SupbaseClient";
import { useUser } from "@clerk/nextjs";
import useExercises from "@/app/hooks/useExercise";
import Title from "@/app/components/Title";
import Button from "@/app/components/Button";
import Label from "@/app/components/Label";
import SetsForm from "@/app/components/SetsForm";
import toast from "react-hot-toast";
import { WorkoutExerciseWithDbId } from "@/app/lib/types";
import {categoryColors} from "@/app/constants/categories";

function EditPage() {
  const [workout, setWorkout] = useState<(Workout & { exercises: WorkoutExerciseWithDbId[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [deletedSetIds, setDeletedSetIds] = useState<number[]>([]);
  const [deletedWeIds, setDeletedWeIds] = useState<number[]>([]);
  const [originalWeIds, setOriginalWeIds] = useState<number[]>([]);
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { exercises } = useExercises(user?.id || "");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("workouts")
        .select(`id, title, date, user_id, workouts_exercises ( id, exercise_id, exercise:exercise!exercise_id ( id, name, category, user_id ), sets ( id, reps, weight ) )`)
        .eq("id", Number(params.id))
        .single();
      if (error || !data) { setLoading(false); return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wes = (data.workouts_exercises || []).map((we: any) => ({
        exerciseId: we.exercise_id,
        workoutExerciseId: we.id,
        exercise: we.exercise ? { id: we.exercise.id, user_id: we.exercise.user_id, name: we.exercise.name, category: we.exercise.category } : null,
        sets: (we.sets || []).map((s: Set) => ({ id: s.id, reps: s.reps, weight: s.weight })),
      }));
      setWorkout({ id: data.id, title: data.title, date: data.date, user_id: data.user_id, exercises: wes });
      setOriginalWeIds(wes.map((w: WorkoutExerciseWithDbId) => w.workoutExerciseId).filter(Boolean) as number[]);
      setLoading(false);
    };
    if (params.id) load();
  }, [params.id]);

  const filtered = exercises.filter(ex =>
    (ex.name.toLowerCase().includes(search.toLowerCase()) || ex.category.toLowerCase().includes(search.toLowerCase())) &&
    !workout?.exercises.some(w => w.exerciseId === ex.id)
  );

  const addExercise = (ex: Exercise) => {
    if (!workout) return;
    if (workout.exercises.some(w => w.exerciseId === ex.id)) return;
    setWorkout({ ...workout, exercises: [...workout.exercises, { exerciseId: ex.id, exercise: ex, sets: [{ id: Date.now(), reps: 0, weight: 0 }] }] });
    setModalOpen(false); setSearch("");
  };

  const removeExercise = (exId: number) => {
    if (!workout) return;
    const we = workout.exercises.find(w => w.exerciseId === exId);
    if (we?.workoutExerciseId && originalWeIds.includes(we.workoutExerciseId)) {
      setDeletedWeIds(p => [...p, we.workoutExerciseId!]);
    }
    we?.sets.forEach(s => { if (s.id < 1e12) setDeletedSetIds(p => [...p, s.id]); });
    setWorkout({ ...workout, exercises: workout.exercises.filter(w => w.exerciseId !== exId) });
  };

  const addSet = (exId: number) => {
    if (!workout) return;
    setWorkout({ ...workout, exercises: workout.exercises.map(w => w.exerciseId === exId ? { ...w, sets: [...w.sets, { id: Date.now(), reps: 0, weight: 0 }] } : w) });
  };

  const updateSet = (exId: number, setId: number, u: Partial<Set>) => {
    if (!workout) return;
    setWorkout({ ...workout, exercises: workout.exercises.map(w => w.exerciseId === exId ? { ...w, sets: w.sets.map(s => s.id === setId ? { ...s, ...u } : s) } : w) });
  };

  const removeSet = (exId: number, setId: number) => {
    if (!workout) return;
    if (setId < 1e12) setDeletedSetIds(p => [...p, setId]);
    const updated = workout.exercises.map(w => w.exerciseId === exId ? { ...w, sets: w.sets.filter(s => s.id !== setId) } : w).filter(w => w.sets.length > 0);
    setWorkout({ ...workout, exercises: updated });
  };

  const handleSave = async () => {
    if (!workout) return;
    setSaving(true);
    try {
      await supabase.from("workouts").update({ title: workout.title, date: workout.date }).eq("id", workout.id);
      if (deletedSetIds.length) await supabase.from("sets").delete().in("id", deletedSetIds);
      if (deletedWeIds.length) await supabase.from("workouts_exercises").delete().in("id", deletedWeIds);
      for (const ex of workout.exercises) {
        if (!ex.workoutExerciseId || !originalWeIds.includes(ex.workoutExerciseId)) {
          const { data: nwe } = await supabase.from("workouts_exercises").insert({ workout_id: workout.id, exercise_id: ex.exerciseId }).select().single();
          if (nwe && ex.sets.length) {
            const ins: SetInsert[] = ex.sets.map(s => ({ reps: s.reps, weight: s.weight, workout_exercise_id: nwe.id }));
            await supabase.from("sets").insert(ins);
          }
        } else {
          for (const s of ex.sets) {
            if (s.id >= 1e12) await supabase.from("sets").insert({ reps: s.reps, weight: s.weight, workout_exercise_id: ex.workoutExerciseId });
            else await supabase.from("sets").update({ reps: s.reps, weight: s.weight }).eq("id", s.id);
          }
        }
      }
      router.push("/pages/workouts");
    } catch (e) { console.error(e); alert("Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!workout || !confirm("Delete this workout permanently?")) return;
    const workoutId = workout.id;

    // step 1: delete from sets table 
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
      toast.error("Failed to delete sets");
      return;
    }

    // step 2: delete from workouts_exercises table
    try {
      const { error } = await supabase
        .from("workouts_exercises")
        .delete()
        .eq("workout_id", workoutId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting workouts_exercises:", error);
      toast.error("Failed to delete workouts_exercises");
      return;
    }

    // step 3: delete from workouts table
    try {
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId);
      if (error) throw error;

      toast.success("Workout deleted successfully");
      router.push("/pages/workouts");
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout");
    }
  };

  if (loading) return (
    <div className="min-h-screen max-w-2xl mx-auto p-4">
      <div className="glass-card p-6 mt-4"><div className="skeleton h-8 w-48 mb-4" /><div className="skeleton h-4 w-32 mb-8" />{[1, 2, 3].map(i => <div key={i} className="skeleton h-20 w-full mt-4" />)}</div>
    </div>
  );

  if (!workout) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4">🔍</div><h2 className="text-xl font-bold text-slate-300 mb-2">Workout not found</h2><Button onClick={() => router.push("/pages/workouts")} px="6" py="3">Back</Button></div>
    </div>
  );

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-4 animate-fade-in">
      <section className="flex items-center justify-between mt-2 mb-6">
        <button onClick={() => router.push("/pages/workouts")} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <Title size="text-xl">Edit Workout</Title>
        <button onClick={handleDelete} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
      </section>

      <div className="glass-card p-6 space-y-5">
        <div><Label htmlFor="editTitle">Workout title</Label><input id="editTitle" type="text" value={workout.title} onChange={e => setWorkout({ ...workout, title: e.target.value })} className="bg-slate-900/80 border border-slate-700/50 p-3 rounded-xl mt-2 text-slate-100 w-full text-base" /></div>
        <div><Label htmlFor="editDate">Date</Label><input id="editDate" type="date" value={workout.date} onChange={e => setWorkout({ ...workout, date: e.target.value })} className="bg-slate-900/80 border border-slate-700/50 p-3 rounded-xl mt-2 text-slate-100 w-full text-base" /></div>
      </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 modal-overlay">
            <div className="w-full max-w-lg glass rounded-2xl p-6 shadow-2xl modal-content">
              <div className="flex items-center justify-between mb-4">
                <Title size="text-lg">Select Exercise</Title>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all cursor-pointer" onClick={() => { setModalOpen(false); setSearch(""); }}>✕</button>
              </div>
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-2.5 text-base text-white placeholder:text-slate-500 mb-4" />
              <ul className="flex flex-col gap-1 max-h-72 overflow-auto">
                {filtered.length === 0 ? <p className="text-center text-slate-500 py-8 text-sm">No exercises found</p> : filtered.map(ex => (
                  <li key={ex.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer transition-all group" onClick={() => addExercise(ex)}>
                    <div><div className="font-semibold text-slate-100 text-sm">{ex.name}</div><div className="text-xs text-slate-500">{ex.category}</div></div>
                    <span className="text-emerald-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">+ Add</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      <div className="glass-card p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <Title size="text-xl">Exercises</Title>
          <Button type="button" width="auto" px="4" py="2" onClick={() => setModalOpen(true)}>+ Add</Button>
        </div>
        {workout.exercises.length === 0 ? (
          <div className="flex flex-col items-center py-12"><div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-3xl mb-4">🏋️</div><p className="text-slate-500 text-sm">No exercises added.</p></div>
        ) : (
          <div className="space-y-5 mt-4">
            {workout.exercises.map(w => (
              <div key={w.exerciseId} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-500" />
                    <h3 className="font-bold text-emerald-400">{w.exercise?.name}</h3>
                    <span className={`text-xs ${categoryColors[w.exercise?.category ?? "default"]} bg-slate-800 px-2 py-0.5 rounded-full`}>{w.exercise?.category ?? "Unknown"}</span>
                  </div>
                  <button type="button" onClick={() => removeExercise(w.exerciseId)} className="text-slate-600 hover:text-rose-400 transition-colors cursor-pointer p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <SetsForm sets={w.sets} onAdd={() => addSet(w.exerciseId)} onUpdate={(sid, u) => updateSet(w.exerciseId, sid, u)} onRemove={sid => removeSet(w.exerciseId, sid)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6 mb-8">
        <Button variant="secondary" width="full" px="6" py="3" onClick={() => router.push("/pages/workouts")}>Cancel</Button>
        <Button width="full" px="6" py="3" onClick={handleSave} disabled={saving}>
          {saving ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</span> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default EditPage;