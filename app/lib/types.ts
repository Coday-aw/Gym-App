type Exercise = {
  id: number;
  user_id: string;
  name: string;
  category: string;
}


type Workout = {
    id: number;
    title: string;
    date: string;
    exercises: WorkoutExercise[];
    user_id: string;
}

type Set = {
    id: number;
    reps: number;
    weight: number;
}
 

type WorkoutExercise = {
    exerciseId: number;
    exercise: Exercise | null;
    sets: Set[]
}


type SetInsert = {
  reps: number;
  weight: number;
  workout_exercise_id: number;
};

type PersonalRecord = {
  exerciseName: string;
  category: string;
  weight: number;
  reps: number;
  date: string;
};

type WorkoutStats = {
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number;
  totalExercises: number;
  avgSetsPerWorkout: number;
  avgVolumePerWorkout: number;
};


export type { Exercise, Workout, WorkoutExercise, Set, SetInsert, PersonalRecord, WorkoutStats }
