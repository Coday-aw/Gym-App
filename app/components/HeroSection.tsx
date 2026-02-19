import Header from "./Header";
import { features, progress } from "../lib/data";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="hero-section py-20 text-center">
      {/* intro section */}
      <section className="px-10">
        <Header size="text-5xl">Forage Your Strength</Header>
        <p className="mt-6 text-lg text-neutral-400">
          Discover your true potential with GymForage, the ultimate workout
          companion that helps you track, analyze, and optimize your fitness
          journey.
        </p>
        <button className="mt-8 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg uppercase font-bold">
          <Link href={'/pages/workouts'}>
          Start training now
          </Link>
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="mt-20 px-10">
            <span className="bg-blue-500/10 px-5 py-1 rounded-4xl text-blue-400 border border-blue-500 font-bold ">Features</span>
        {features.map((feature) => (
          <div
            key={feature.title}
            className=" border border-neutral-800 bg-neutral-800 rounded-2xl p-6 mt-10 flex flex-col items-start text-start gap-2"
          >
            <span className="text-3xl">{feature.icon}</span>
            <Header size="text-2xl">{feature.title}</Header>
            <p className="text-neutral-400">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Progress section */}
      <section id="progress" className="mt-10 px-10 py-10 bg-neutral-800">
        <span className="bg-blue-500/10 px-5 py-1 rounded-4xl text-blue-400 border border-blue-500 font-bold ">Progress</span>
      { progress.map((prog, index) => (
        <div key={index} className="flex flex-col gap-3 justify-center items-center">
          <span className="mt-10 bg-blue-600 rounded-full w-16 h-16 flex justify-center items-center text-3xl ">{index + 1}</span>
          <Header size="text-md">{prog.title}</Header>
          <p className="text-neutral-400">{prog.discription}</p>
        </div>
      ))}
      </section>
    </section>
  );
};

export default HeroSection;
