import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative border-t border-slate-800/50 mt-8">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-black tracking-tight mb-3">
              <span className="gradient-text">GYM</span>
              <span className="text-slate-100">FORAGE</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              The ultimate fitness tracking app designed for tracking and creating
              your own exercises.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Product
            </h3>
            <div className="flex flex-col gap-2">
              <Link href="#features" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                Features
              </Link>
              <Link href="#progress" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                How it Works
              </Link>
              <Link href="/sign-in" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                Get Started
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              {["Chest", "Back", "Legs", "Shoulders", "Arms"].map((cat) => (
                <span key={cat} className="text-slate-400 text-sm">
                  {cat} Training
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 mt-10 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 GymForage. Built for champions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
