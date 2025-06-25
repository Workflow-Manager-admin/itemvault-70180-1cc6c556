import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full px-6 pt-8">
      <main className="flex flex-col flex-1 items-center justify-center gap-10 w-full max-w-3xl text-center">
        <div className="mb-1 mt-8 sm:mt-12">
          <span className="inline-block rounded bg-primary/10 text-primary font-semibold text-xs px-4 py-1 mb-5 tracking-widest uppercase">Modern & Minimal</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary mb-2">ItemVault</h1>
          <p className="text-lg md:text-xl font-medium text-foreground/70 max-w-xl mx-auto mb-6">
            A delightfully simple way to manage your items, notes, or inventory.
            <br className="hidden md:inline" /> Secure. Fast. Refined.
          </p>
        </div>
        <div className="flex gap-5 flex-wrap justify-center">
          <a
            className="bg-primary text-white rounded-lg font-bold text-base px-8 py-3 transition-colors duration-200 hover:bg-[#1760bb] shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href="/register"
          >
            Get Started For Free
          </a>
          <a
            className="bg-accent text-white rounded-lg font-bold text-base px-8 py-3 transition-colors duration-200 hover:bg-[#31904a] shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            href="/items"
          >
            Demo App
          </a>
        </div>
        <Image
          className="mx-auto shadow-lg rounded-lg mt-5"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="w-full mt-16 mb-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            <div className="rounded-lg bg-white/80 border p-4 shadow flex flex-col gap-2 items-center">
              <span className="text-primary font-bold text-lg">Secure Auth</span>
              <span className="text-sm text-foreground/70">JWT login, protected routes, session checking.</span>
            </div>
            <div className="rounded-lg bg-white/80 border p-4 shadow flex flex-col gap-2 items-center">
              <span className="text-accent font-bold text-lg">CRUD Items</span>
              <span className="text-sm text-foreground/70">Create, edit, and delete items intuitively.</span>
            </div>
            <div className="rounded-lg bg-white/80 border p-4 shadow flex flex-col gap-2 items-center">
              <span className="text-secondary font-bold text-lg">Modern UI</span>
              <span className="text-sm text-foreground/70">Fast, minimal, works on all devices.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
