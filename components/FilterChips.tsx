"use client";

import Link from "next/link";

interface FilterChipsProps {
  categories: string[];
  active: string;
  search?: string;
}

export default function FilterChips({ categories, active, search }: FilterChipsProps) {
  return (
    <div className="sticky top-14 z-40 bg-[#0f0f0f] border-b border-[#272727]">
      <div className="flex gap-3 ml-14 pr-6 py-3 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
        {categories.map(cat => {
          const isActive = active === cat;
          const href = cat === "Все" ? (search ? `/?q=${encodeURIComponent(search)}` : "/") : `/?cat=${encodeURIComponent(cat)}${search ? `&q=${encodeURIComponent(search)}` : ""}`;
          return (
            <Link
              key={cat}
              href={href}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                isActive
                  ? "bg-white text-black"
                  : "bg-[#272727] text-white hover:bg-[#3f3f3f]"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
