"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X, UserRound } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import type { Category } from "@/types/category";

type NavbarProps = {
  categories?: Category[];
};

export default function Navbar({ categories = [] }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Better Auth session management
  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const user = session?.user;

  // Bangladesh date
  const today = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Logout functionality
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "লগআউট করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে লগআউট হয়েছে!");

      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch {
      toast.error("লগআউট করতে সমস্যা হয়েছে।");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="container-main flex min-h-20 items-center justify-between gap-4">

        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/assets/logo-icon.png"
            alt="বাজার দর লোগো"
            width={46}
            height={46}
            className="object-contain"
          />

          <div>
            <p className="text-xl font-bold text-green-800">
              বাজার দর
            </p>

            <p className="text-xs text-gray-500">
              {today}
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="প্রধান নেভিগেশন"
          className="hidden items-center gap-5 lg:flex"
        >
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors ${
              pathname === "/"
                ? "text-green-700"
                : "text-gray-600 hover:text-green-700"
            }`}
          >
            হোম
          </Link>

          {categories.map((category) => {
            const href = `/category/${category.slug}`;
            const active = pathname === href;

            return (
              <Link
                key={category.slug}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-green-700"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                {category.nameBn}
              </Link>
            );
          })}
        </nav>

        {/* Desktop authentication */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">

          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50"
              >
                <UserRound size={18} />

                <span className="max-w-28 truncate">
                  {user.name}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={17} />

                {loggingOut ? "অপেক্ষা করুন..." : "লগআউট"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          className="rounded-lg border border-gray-200 p-2 text-gray-700 lg:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="মোবাইল নেভিগেশন"
          className="border-t border-gray-100 bg-white px-4 py-5 lg:hidden"
        >
          <div className="container-main flex flex-col gap-4">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-gray-700"
            >
              হোম
            </Link>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-gray-600"
              >
                {category.nameBn}
              </Link>
            ))}

            {/* Mobile authentication */}
            <div className="mt-3 border-t border-gray-100 pt-4">

              {isPending ? (
                <div className="h-11 animate-pulse rounded-lg bg-gray-100" />
              ) : user ? (
                <div className="flex flex-col gap-3">

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 font-semibold text-green-800"
                  >
                    <UserRound size={20} />

                    <span className="truncate">
                      {user.name}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <LogOut size={18} />

                    {loggingOut ? "অপেক্ষা করুন..." : "লগআউট"}
                  </button>

                </div>
              ) : (
                <div className="flex gap-3">

                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-700 px-4 py-3 font-semibold text-green-700"
                  >
                    <UserRound size={18} />

                    সাইন ইন
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-lg bg-green-700 px-4 py-3 font-semibold text-white"
                  >
                    সাইন আপ
                  </Link>

                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}