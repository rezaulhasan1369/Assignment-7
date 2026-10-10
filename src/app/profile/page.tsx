"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, Mail, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const user = session?.user;

  // Redirect guests to Sign In.
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in?callbackUrl=%2Fprofile");
    }
  }, [isPending, user, router]);

  // Populate the name field from the current session.
  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user?.id, user?.name]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (trimmedName === user?.name) {
      toast("No changes to save.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          {isPending ? "Loading your profile..." : "Redirecting to sign in..."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your BazarDor account information.
          </p>
        </div>

        {/* Profile card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-emerald-50 px-6 py-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <UserRound size={40} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user.email}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Account information */}
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Account Information
              </h3>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <Mail size={20} className="text-emerald-700" />

                <div>
                  <p className="text-xs text-slate-500">
                    Email Address
                  </p>

                  <p className="font-medium text-slate-800">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <ShieldCheck
                  size={20}
                  className="text-emerald-700"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Account Status
                  </p>

                  <p className="font-medium text-slate-800">
                    Active Account
                  </p>
                </div>
              </div>
            </div>

            {/* Edit profile */}
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Display Name
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter your display name"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}