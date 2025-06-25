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
    <div className="max-w-sm mx-auto mt-20 border p-6 rounded shadow bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">Register for ItemVault</h1>
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
          className="bg-accent text-white px-4 py-2 rounded w-full"
          disabled={submitting}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <a className="text-primary hover:underline" href="/login">Login here</a>
      </p>
    </div>
  );
}
