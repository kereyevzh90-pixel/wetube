"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "Главная",
    icon: (
      <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    href: "/shorts",
    label: "Шортс",
    icon: (
      <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.56-3.22 1.6-5.06s-3.22-2.56-5.06-1.6L6 6.94c-1.29.68-2.07 2.01-2 3.44.07 1.43.93 2.67 2.28 3.22l1.2.5L6 14.94c-1.84.96-2.56 3.22-1.6 5.06.96 1.84 3.22 2.56 5.06 1.6l8.54-4.54c1.29-.68 2.07-2.01 2-3.44-.07-1.43-.93-2.67-2.23-3.3zM10 14.45v-5l5 2.5-5 2.5z" />
      </svg>
    ),
  },
  {
    href: "/subscriptions",
    label: "Подписки",
    icon: (
      <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "История",
    icon: (
      <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    ),
  },
  {
    href: "/upload",
    label: "Загрузить",
    icon: (
      <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
      </svg>
    ),
  },
];

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-14 h-[calc(100vh-56px)] bg-[#0f0f0f] z-40 overflow-hidden transition-[width] duration-200 ${
        open ? "w-60" : "w-0"
      }`}
    >
      <div className="flex flex-col pt-4 pb-4 px-3 gap-1 w-60">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-5 px-5 py-3.5 rounded-xl transition whitespace-nowrap ${
                active
                  ? "bg-[#272727] text-white"
                  : "text-[#aaa] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
