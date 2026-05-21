import Title from "./Title";
import { features, progress } from "../lib/data";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />

      {/* Hero */}
      <section className="relative px-6 py-24 text-center max-w-2xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Your fitness journey starts here
        </div>

        <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight">
          Forage Your{" "}
          <span className="gradient-text">Strength</span>
        </h1>

        <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg mx-auto">
          Discover your true potential with GymForage, the ultimate workout
          companion that helps you track, analyze, and optimize your fitness
          journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/pages/workouts"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 active:scale-95"
          >
            Start Training Now
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">
            Features
          </span>
          <h2 className="text-3xl font-bold text-slate-100">
            Everything you need to <span className="gradient-text">level up</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6 flex flex-col items-start text-start gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="progress" className="relative px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4">
              How it Works
            </span>
            <h2 className="text-3xl font-bold text-slate-100">
              Three steps to <span className="gradient-text-purple">greatness</span>
            </h2>
          </div>

          <div className="relative flex flex-col gap-8">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500/50 via-cyan-500/50 to-violet-500/50 hidden sm:block" />

            {progress.map((prog, index) => (
              <div key={index} className="flex items-start gap-5 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                  {index + 1}
                </div>
                <div className="glass-card p-5 flex-1">
                  <h3 className="font-bold text-slate-100 text-lg mb-1">
                    {prog.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {prog.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default HeroSection;
