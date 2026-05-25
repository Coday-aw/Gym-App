"use client";

import { useEffect } from "react";
import Button from "./components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 shadow-xl border border-rose-500/20">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-black text-white tracking-tight mb-3">
        Something went wrong
      </h1>
      
      <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
        We encountered an unexpected error. Don't worry, your data is safe.
      </p>
      
      <div className="flex gap-4">
        <Button onClick={() => reset()} px="6" py="3">
          Try again
        </Button>
        <Button variant="secondary" onClick={() => window.location.href = '/'} px="6" py="3">
          Go Home
        </Button>
      </div>
    </div>
  );
}
