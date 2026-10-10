"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient, socialAuthErrorMessage } from "@/lib/auth-client";

type SocialProvider = "google" | "github";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);

  const isBusy = loading || socialLoading !== null;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isBusy) return;

    if (name.trim().length < 2) {
      toast.error(
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(
          error.message || "Registration failed."
        );
        return;
      }

      toast.success("Account created successfully!");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignUp(
    provider: SocialProvider
  ) {
    if (isBusy) return;

    setSocialLoading(provider);

    try {
      // Better Auth uses signIn.social() for both
      // social sign-in and first-time social registration.
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/sign-up",
      });

      if (error) {
        toast.error(
          socialAuthErrorMessage(error, provider)
        );
        setSocialLoading(null);
      }

      // Better Auth handles the OAuth redirect.
    } catch {
      toast.error(
        `Unable to connect to ${
          provider === "google" ? "Google" : "GitHub"
        }.`
      );
      setSocialLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join BazarDor to explore detailed market prices.
          </p>
        </div>

        {/* Social registration */}
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {socialLoading === "google" ? (
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
            ) : (
              <Image src="/assets/google.svg" alt="" width={20} height={20} className="shrink-0" />
            )}

            <span>
              {socialLoading === "google"
                ? "Connecting to Google..."
                : "Continue with Google"}
            </span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {socialLoading === "github" ? (
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
            ) : (
              <Image src="/assets/github.svg" alt="" width={20} height={20} className="shrink-0" />
            )}

            <span>
              {socialLoading === "github"
                ? "Connecting to GitHub..."
                : "Continue with GitHub"}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium uppercase text-slate-400">
            Or register with email
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Registration form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Full name */}
          <div>
            <label
              htmlFor="sign-up-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="sign-up-name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your full name"
                disabled={isBusy}
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="sign-up-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="sign-up-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                disabled={isBusy}
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="sign-up-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="sign-up-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                disabled={isBusy}
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="sign-up-confirm-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="sign-up-confirm-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                disabled={isBusy}
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            )}

            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Sign-in link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-green-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
