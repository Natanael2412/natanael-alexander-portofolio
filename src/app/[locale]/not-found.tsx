import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-montserrat z-[99999] relative">
      <h1 className="font-playfair text-8xl md:text-[150px] font-black mb-4">404</h1>
      <p className="tracking-[0.2em] text-xs md:text-sm uppercase mb-8 opacity-60 text-center px-4">
        Page not found or still in development.
      </p>
      <Link
        href="/"
        className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors text-xs tracking-widest uppercase"
      >
        Return Home
      </Link>
    </div>
  );
}
