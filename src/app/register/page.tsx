"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        const msg = result.errors
          ? Object.values(result.errors).join(". ")
          : result.error || "Registration failed";
        setError(msg);
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold mb-2">Create account</h1>
            <p className="text-gray-500 text-sm">Join Fantasy Travels</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full name</label>
              <input
                {...register("name", { required: "Required" })}
                placeholder="Your name"
                className={inputClass}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                {...register("email", {
                  required: "Required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                })}
                type="email"
                placeholder="you@email.com"
                className={inputClass}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                {...register("password", {
                  required: "Required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: "Must include uppercase, lowercase and a number",
                  },
                })}
                type="password"
                placeholder="••••••••"
                className={inputClass}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white py-3 rounded-2xl font-semibold transition-all"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
