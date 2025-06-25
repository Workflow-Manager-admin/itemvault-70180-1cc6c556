"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    router.replace("/items");
    return null;
  }

  // PUBLIC_INTERFACE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      router.replace("/items");
    } catch {
      // handled by context + toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 xs:mt-28 border bg-white rounded-xl shadow-md p-7">
      <h1 className="text-2xl font-extrabold mb-6 text-primary text-center">Sign in to ItemVault</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="text-sm text-primary font-bold" htmlFor="login-username">Username</label>
        <input
          className="border px-4 py-2 rounded-lg w-full bg-[var(--background)] focus:outline-primary"
          type="text"
          name="username"
          id="login-username"
          placeholder="Username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <label className="text-sm text-primary font-bold" htmlFor="login-password">Password</label>
        <input
          className="border px-4 py-2 rounded-lg w-full bg-[var(--background)] focus:outline-primary"
          type="password"
          name="password"
          id="login-password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="btn-primary mt-1"
          disabled={submitting || loading}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-7 text-center text-sm">
        New? <a className="text-primary hover:underline font-bold" href="/register">Register here</a>
      </p>
      <style jsx>{`
        .btn-primary {
          background: var(--primary);
          color: #fff;
          padding: 0.7rem 0;
          border-radius: 0.5rem;
          font-weight: 700;
          outline: none;
          border: none;
          transition: background 0.18s;
          width: 100%;
          font-size: 1rem;
        }
        .btn-primary:hover:not(:disabled) {
          background: #1760bb;
        }
      `}</style>
    </div>
  );
}
