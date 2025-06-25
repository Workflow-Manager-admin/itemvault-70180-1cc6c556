"use client";
import { useEffect } from "react";

// PUBLIC_INTERFACE
export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // Could send error to logging service here
  }, [error]);
  return (
    <div className="w-full min-h-56 flex flex-col items-center justify-center py-20">
      <div className="text-xl font-bold text-red-600 mb-3">Something went wrong</div>
      <pre className="bg-red-100 border border-red-300 rounded-lg py-2 px-4 mb-3 text-sm text-red-800">
        {error.message || "An unexpected error occurred."}
      </pre>
      <button
        className="bg-primary text-white rounded-lg px-5 py-2 font-bold shadow hover:bg-blue-700"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
