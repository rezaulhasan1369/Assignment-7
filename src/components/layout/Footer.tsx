import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-green-100 bg-[#f4f9f4]">
      <div className="container-main py-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* LEFT SIDE */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/assets/logo-icon.png"
                alt="বাজার দর লোগো"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />

              <span className="text-2xl font-bold text-green-800">
                বাজার দর
              </span>
            </Link>

            <p className="mt-4 max-w-md text-base leading-7 text-gray-600">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:text-right">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              গুরুত্বপূর্ণ তথ্য
            </h3>

            <p className="text-sm leading-7 text-gray-600">
              সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
            </p>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-10 border-t border-green-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} বাজার দর। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
}