import { useEffect, useState } from 'react';
import { Exercise} from '../lib/types';
import { useSupabase } from '../lib/SupbaseClient';

const useExercises = (userId: string) => {
  const supabase = useSupabase();
  const [exercises, setExercises] = useState<Exercise[]>([])

  const fetchData = async () => {
  try {
    const { data, error } = await supabase.from("exercise").select("*").eq("user_id", userId);
    if (error) {
      console.log(error)
      return
    }
    if (data) {
      setExercises(data?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        user_id: item.user_id
      })) ?? [] )
    }
  } catch (error) {
    console.log(error)
  }
}

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [userId, supabase]);

return { exercises, refresh: fetchData }
}


export default useExercises