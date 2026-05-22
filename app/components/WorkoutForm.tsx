"use client"
import { useState } from "react";
import Title from "./Title";
import Button from "./Button";
import Label from "./Label";
import { Exercise, Set, Workout, SetInsert } from "../lib/types";
import useExercises from "../hooks/useExercise";
import { supabase } from "../lib/SupbaseClient";
import SetsForm from "./SetsForm";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";


const WorkoutForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  const { exercises } = useExercises(user?.id || "");
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout>({
    id: 0,
    title: "",
    user_id: user?.id || "",
    date: new Date().toISOString().split("T")[0],
    exercises: []
  })

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // add new workout to database 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (workout.exercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    // we need to insert into workout table, then workout_exercise table and finally the sets table. If any of the inserts fail we need to rollback the previous inserts to maintain data integrity.
    let workoutId: number | null = null;
    let workoutExerciseIds: number[] = [];
    setSaving(true);

    try {
      // insert into workout table
      const { data: workoutRow, error: workoutRowError } = await supabase
        .from("workouts")
        .insert({ title: workout.title, date: workout.date, user_id: workout.user_id })
        .select()
        .single();
      if (workoutRowError || !workoutRow)
        throw workoutRowError;

      workoutId = workoutRow.id;
      // insert into workout_exersice table
      const workoutExercisesToInsert = workout.exercises.map(w => ({
        workout_id: workoutRow.id,
        exercise_id: w.exerciseId
      }))

      const { data: workoutExerciseRows, error: workoutExerciseRowsError } = await supabase
        .from("workouts_exercises")
        .insert(workoutExercisesToInsert)
        .select();
      if (workoutExerciseRowsError)
        throw workoutExerciseRowsError

      workoutExerciseIds = workoutExerciseRows.map(we => we.id);
      // insert into the sets table
      const setsToInsert: SetInsert[] = [];

      for (const w of workout.exercises) {
        const workoutExercise = workoutExerciseRows?.find(
          we => we.exercise_id === w.exerciseId
        );

        if (!workoutExercise || !workoutExercise.id) {
          console.log("workout exercise id is null")
          return
        }

        w.sets.forEach(s => {
          setsToInsert.push({
            reps: s.reps,
            weight: s.weight,
            workout_exercise_id: workoutExercise.id
          })
        })
      }


      const { error: setsError } = await supabase.from("sets").insert(setsToInsert)
      if (setsError)
        throw setsError;

      toast.success("Workout saved successfully!");
      router.push("/pages/workouts");

    } catch (error) {
      console.log("Error creating workout", error)
      toast.error("Failed to save workout");

      // if sets fails Rollback previous inserts
      if (workoutExerciseIds.length > 0) {
        const { error: deleteWorkoutExerciseError } = await supabase.from("workouts_exercises").delete().in("id", workoutExerciseIds)
        if (deleteWorkoutExerciseError) {
          console.log("Error rolling back workout exercise creation", deleteWorkoutExerciseError)
        }
      }

      if (workoutId) {
        const { error: deleteWorkoutError } = await supabase.from("workouts").delete().eq("id", workoutId)
        if (deleteWorkoutError) {
          console.log("Error rolling back workout creation", deleteWorkoutError)
        }
      }
    } finally {
      setSaving(false);
    }
  }
  // add new exercise
  const addExercise = (exercise: Exercise) => {
    setWorkout(prev => {
      const exist = prev.exercises.some(w => w.exerciseId === exercise.id);
      if (exist) return prev;

      return {
        ...prev, exercises: [...prev.exercises,
        {
          exerciseId: exercise.id,
          exercise,
          sets: [{ id: Date.now(), reps: 0, weight: 0, }]
        }
        ]
      };
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  // add new set 
  const addSet = (exerciseId: number) => {
    setWorkout(prev => ({
      ...prev, exercises: prev.exercises.map(w => w.exerciseId === exerciseId ?
        {
          ...w,
          sets: [...w.sets, { id: Date.now(), reps: 0, weight: 0 }]
        }
        : w
      )
    }));
  }

  // update set
  const updateSet = (exerciseId: number, setId: number, updated: Partial<Set>) => {
    setWorkout(prev => ({
      ...prev, exercises: prev.exercises.map(w => w.exerciseId === exerciseId ?
        {
          ...w, sets: w.sets.map(s => s.id === setId ? { ...s, ...updated }
            : s
          )
        }
        : w
      )
    })
    )
  }

  // remove a set 
  const removeSet = (exercixeId: number, setId: number) => {
    setWorkout(prev => {
      const updatedExercises = prev.exercises.map(w => w.exerciseId === exercixeId ?
        { ...w, sets: w.sets.filter(s => s.id !== setId) }
        : w
      )
        .filter(w => w.sets.length > 0)
      return { ...prev, exercises: updatedExercises }
    })
  }

  return (
    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
      <div className="glass-card p-6 space-y-5">
        <div>
          <Label htmlFor="WorkoutTitle">Workout title</Label>
          <input
            type="text"
            id="WorkoutTitle"
            placeholder="e.g. Leg day, Push day..."
            onChange={(e) => setWorkout(prev => ({ ...prev, title: e.target.value }))}
            value={workout.title || ""}
            className="bg-slate-900/80 border border-slate-700/50 p-3 rounded-xl mt-2 text-slate-100 w-full text-base"
          />
        </div>
        <div>
          <Label htmlFor="WorkoutDate">Workout date</Label>
          <input
            id="WorkoutDate"
            type="date"
            onChange={(e) => setWorkout(prev => ({ ...prev, date: e.target.value }))}
            value={workout.date}
            className="bg-slate-900/80 border border-slate-700/50 p-3 rounded-xl mt-2 text-slate-100 w-full text-base"
          />
        </div>
      </div>

      {/* search and add exercise */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 modal-overlay">
            <div className="w-full max-w-lg glass rounded-2xl p-6 shadow-2xl modal-content">
              <div className="flex items-center justify-between mb-4">
                <Title size="text-lg">Select Exercise</Title>
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all cursor-pointer"
                  onClick={() => { setIsOpen(false); setSearchTerm(""); }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-2.5 text-base text-white placeholder:text-slate-500 mb-4"
              />

              <ul className="flex flex-col gap-1 max-h-72 overflow-auto">
                {filteredExercises.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm mb-4">No exercises found, Start by creating exercises </p>
                    <Link href="/pages/exercises">
                      <Button px="4" py="2">
                        Create Exercises
                      </Button>
                    </Link>
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <li
                      key={exercise.id}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-700/50 cursor-pointer transition-all duration-150 group"
                      onClick={() => addExercise(exercise)}
                    >
                      <div>
                        <div className="font-semibold text-slate-100 text-sm">{exercise.name}</div>
                        <div className="text-xs text-slate-500">{exercise.category}</div>
                      </div>
                      <span className="text-emerald-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        + Add
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <Title size="text-xl">Exercises</Title>
          <Button type="button" width="auto" px="4" py="2" onClick={() => setIsOpen(!isOpen)}>
            + Add
          </Button>
        </div>

      
    
        {/* display added exercises */}
        {workout.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-3xl mb-4">
              🏋️
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              No exercises added yet. Tap &quot;Add&quot; to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-4 stagger-children">
            {workout.exercises.map(w => (
              <div key={w.exerciseId} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-500" />
                  <h3 className="font-bold text-emerald-400">{w.exercise?.name}</h3>
                  <span className="text-xs text-slate-500 ml-auto">{w.sets.length} sets</span>
                </div>
                <SetsForm
                  sets={w.sets}
                  onAdd={() => addSet(w.exerciseId)}
                  onUpdate={(setId, updated) => updateSet(w.exerciseId, setId, updated)}
                  onRemove={(setId) => removeSet(w.exerciseId, setId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button width="full" px="6" py="3" type="submit" disabled={saving}>
        {saving ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </span>
        ) : (
          "Save Workout"
        )}
      </Button>
    </form>
  );
};

export default WorkoutForm;