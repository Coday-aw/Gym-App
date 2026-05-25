"use client";

import Link from "next/link";
import Button from "./components/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-3xl bg-slate-800/50 flex items-center justify-center text-5xl mb-6 shadow-xl border border-slate-700/50">
        404
      </div>
      
      <h1 className="text-3xl font-black text-white tracking-tight mb-3">
        Page Not Found
      </h1>
      
      <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
        We couldn't find what you were looking for. The workout or page might have been deleted, or the link is incorrect.
      </p>
      
      <Link href="/">
        <Button px="8" py="3.5">
          <span className="flex items-center gap-2 text-[15px]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </span>
        </Button>
      </Link>
    </div>
  );
}
