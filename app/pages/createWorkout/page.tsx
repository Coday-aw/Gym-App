
import Button from "@/app/components/Button";
import Title from "@/app/components/Title";
import WorkoutForm from "@/app/components/WorkoutForm";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

function CreateWorkoutPage() {
  return (
    <div className="p-4">
      {/* Header section of the create workout page */}
      <section className=" border border-slate-700 p-6 flex justify-between items-center rounded-2xl">
        <Link href={"./workouts"}>
          <Button width="auto" px="6" py="3">
            <IoMdArrowRoundBack size={20} />
          </Button>
        </Link>
        <Title size="text-2xl">New Workout</Title>
      </section>
      <WorkoutForm />
    </div>
  );
}

export default CreateWorkoutPage;
