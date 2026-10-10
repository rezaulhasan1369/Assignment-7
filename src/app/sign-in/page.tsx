"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient, socialAuthErrorMessage } from "@/lib/auth-client";

type SocialProvider = "google" | "github";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const oauthErrorMessages: Record<string, string> = {
    account_not_linked: "An account with this email already exists, but GitHub is not linked to it. Sign in using the method you originally used.",
    access_denied: "Authorization was cancelled. Please try again.",
    invalid_code: "OAuth authorization could not be verified. Please try again.",
    state_not_found: "Your sign-in attempt expired. Please try again.",
    email_not_found: "Your provider did not supply an email address. Check your provider email settings.",
    email_not_verified: "Verify your email address with your provider before signing in.",
    unable_to_link_account: "This email may already use another sign-in method. Sign in using your original method.",
    account_already_linked_to_different_user: "This provider account is already linked to another user.",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);

  // Preserve safe internal destinations after authentication.
  const requestedCallback = searchParams.get("callbackUrl");

  const callbackUrl =
    requestedCallback &&
    (/^\/product\/[a-zA-Z0-9_-]+$/.test(requestedCallback) ||
      requestedCallback === "/profile")
      ? requestedCallback
      : "/";

  const isBusy = loading || socialLoading !== null;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isBusy) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(
          error.message || "Invalid email or password."
        );
        return;
      }

      toast.success("Signed in successfully!");

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(
    provider: SocialProvider
  ) {
    if (isBusy) return;

    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
        errorCallbackURL: "/sign-in",
      });

      if (error) {
        toast.error(
          socialAuthErrorMessage(error, provider)
        );
        setSocialLoading(null);
      }

      // Better Auth handles the external OAuth redirect.
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
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your BazarDor account.
          </p>
        </div>

        {/* Social authentication */}
        {oauthError && (
          <p role="alert" className="mb-4 text-sm text-red-700">
            {Object.hasOwn(oauthErrorMessages, oauthError)
              ? oauthErrorMessages[oauthError]
              : "Social sign-in failed. Please try again or use your existing sign-in method."}
          </p>
        )}
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
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
            onClick={() => handleSocialSignIn("github")}
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
            Or continue with email
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Email/password form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="sign-in-email"
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
                id="sign-in-email"
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
              htmlFor="sign-in-password"
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
                id="sign-in-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
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

            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Registration link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-green-700 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}

// Suspense is required when using useSearchParams()
// with the Next.js App Router.
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-16">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 text-slate-500">
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
              <span>Loading sign-in...</span>
            </div>
          </div>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
