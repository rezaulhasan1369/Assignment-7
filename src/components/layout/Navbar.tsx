"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, UserRound } from "lucide-react";
import type { Category } from "@/types/category";



type NavbarProps = {
  categories?: Category[];
};

export default function Navbar({ categories = [] }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const today = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

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
            <p className="text-xs text-gray-500">{today}</p>
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

        {/* Desktop authentication buttons */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/signin"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            সাইন আপ
          </Link>
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

            <div className="mt-3 flex gap-3 border-t border-gray-100 pt-4">
              <Link
                href="/signin"
                onClick={() => setMenuOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-700 px-4 py-3 font-semibold text-green-700"
              >
                <UserRound size={18} />
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex flex-1 items-center justify-center rounded-lg bg-green-700 px-4 py-3 font-semibold text-white"
              >
                সাইন আপ
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}