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
    <div className="max-w-sm mx-auto mt-20 border p-6 rounded shadow bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">Login to ItemVault</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="border px-2 py-1 rounded w-full"
          type="text"
          name="username"
          placeholder="Username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="border px-2 py-1 rounded w-full"
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded w-full"
          disabled={submitting || loading}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center">
        New? <a className="text-primary hover:underline" href="/register">Register here</a>
      </p>
    </div>
  );
}
