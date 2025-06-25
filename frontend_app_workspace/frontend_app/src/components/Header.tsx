"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 shadow mb-6 bg-white dark:bg-black">
      <div>
        <Link href="/" className="font-bold text-lg text-primary">
          ItemVault
        </Link>
      </div>
      <nav className="flex gap-4">
        {user ? (
          <>
            <span className="text-gray-700">Hello, {user.username}</span>
            <Link href="/items" className="text-primary font-semibold hover:underline">
              Items
            </Link>
            <button
              className="bg-secondary text-white px-3 py-1 rounded hover:bg-opacity-90"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
            <Link href="/register" className="text-accent font-semibold hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
