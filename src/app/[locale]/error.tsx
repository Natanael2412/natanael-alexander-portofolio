"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-montserrat z-[99999] relative">
      <h1 className="font-playfair text-6xl font-black mb-4">ERROR</h1>
      <p className="tracking-[0.2em] text-xs uppercase mb-8 opacity-60">Something went wrong.</p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors text-xs tracking-widest uppercase"
      >
        Try Again
      </button>
    </div>
  );
}
