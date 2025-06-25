"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full px-2 py-3 lg:px-8 border-b flex flex-wrap items-center justify-between bg-white/90 dark:bg-black/80 shadow-sm z-10 sticky top-0">
      <Link href="/" className="font-extrabold tracking-tight text-xl sm:text-2xl text-primary" tabIndex={0}>
        ItemVault
      </Link>
      <nav className="flex flex-wrap gap-2 lg:gap-4 items-center mt-2 lg:mt-0">
        {user ? (
          <>
            <span className="hidden md:inline-block text-foreground/70 text-sm px-2">Hi, {user.username}</span>
            <Link href="/items" className="navlink">
              <span className="text-primary font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors">Items</span>
            </Link>
            <button
              className="btn-secondary"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="navlink">
              <span className="text-primary font-medium px-3 py-1 rounded hover:bg-primary/10 transition-colors">Login</span>
            </Link>
            <Link href="/register" className="navlink">
              <span className="text-accent font-medium px-3 py-1 rounded hover:bg-accent/10 transition-colors">Register</span>
            </Link>
          </>
        )}
      </nav>
      <style jsx>{`
        .btn-secondary {
          background: var(--secondary);
          color: #fff;
          padding: 0.5rem 1.2rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: #e6a900;
        }
        .navlink:focus-visible span {
          outline: 2px solid var(--primary);
        }
      `}</style>
    </header>
  );
}
