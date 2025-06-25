"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register as apiRegister, setAuthToken } from "../../utils/api";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const { login, user } = useAuth();
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
      const res = await apiRegister(form.username, form.password);
      setAuthToken(res.data.token);
      await login(form.username, form.password); // fetch profile etc
      toast.success("Registered and logged in!");
      router.replace("/items");
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(
        error?.response?.data?.detail || "Registration failed. Try another username."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 xs:mt-28 border bg-white rounded-xl shadow-md p-7">
      <h1 className="text-2xl font-extrabold mb-6 text-accent text-center">Create your ItemVault Account</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="text-sm text-accent font-bold" htmlFor="reg-username">Username</label>
        <input
          className="border px-4 py-2 rounded-lg w-full bg-[var(--background)] focus:outline-accent"
          type="text"
          name="username"
          id="reg-username"
          placeholder="Username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <label className="text-sm text-accent font-bold" htmlFor="reg-password">Password</label>
        <input
          className="border px-4 py-2 rounded-lg w-full bg-[var(--background)] focus:outline-accent"
          type="password"
          name="password"
          id="reg-password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="btn-accent mt-1"
          disabled={submitting}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        Already have an account? <a className="text-primary hover:underline font-bold" href="/login">Login here</a>
      </p>
      <style jsx>{`
        .btn-accent {
          background: var(--accent);
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
        .btn-accent:hover:not(:disabled) {
          background: #248345;
        }
      `}</style>
    </div>
  );
}
