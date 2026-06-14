"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) router.push(`/?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f] flex items-center justify-between px-4 pl-6 h-14">
      {/* Left: Logo + hamburger */}
      <div className="flex items-center gap-4 shrink-0 w-[240px] ml-4">
        <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-[#272727] transition">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-0.5">
          <span className="text-[22px] font-bold tracking-tight text-[#ff0000]">We</span>
          <span className="text-[22px] font-bold tracking-tight text-white">Tube</span>
        </Link>
      </div>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-[600px] mx-4">
        <div className="flex flex-1 items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск"
            className="flex-1 min-w-0 h-10 bg-transparent border border-[#303030] border-r-0 focus:border-[#1c62b9] outline-none text-white text-sm px-4 rounded-l-full placeholder-[#717171] transition"
          />
          <button
            type="submit"
            className="h-10 px-5 bg-[#222222] border border-[#303030] rounded-r-full hover:bg-[#3a3a3a] transition flex items-center shrink-0"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </form>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0 w-[240px] justify-end">
        {status !== "loading" && !session && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/setup" })}
            className="flex items-center gap-2 border border-[#3d5a99] text-[#3d98ff] hover:bg-[#263850] text-sm px-4 py-2 rounded-full transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Войти
          </button>
        )}
        {session && (
          <>
            <Link href="/upload" title="Загрузить видео" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#272727] transition">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </Link>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#272727] transition">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </button>
            <div className="relative ml-1">
              <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 rounded-full overflow-hidden">
                {session.user?.image ? (
                  <Image src={session.user.image} alt="avatar" width={32} height={32} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-11 bg-[#282828] border border-[#3f3f3f] rounded-xl w-60 py-2 shadow-2xl z-50">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {session.user?.image && <Image src={session.user.image} alt="" width={40} height={40} className="rounded-full"/>}
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-[#aaa] truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  <hr className="border-[#3f3f3f] my-1"/>
                  <Link href="/upload" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-[#3f3f3f] transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    Загрузить видео
                  </Link>
                  <hr className="border-[#3f3f3f] my-1"/>
                  <button onClick={() => { signOut(); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white hover:bg-[#3f3f3f] transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
