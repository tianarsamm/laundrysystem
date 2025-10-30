"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
        <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10"
        />

          <span className="font-bold text-indigo-700 text-xl">Smart Laundry</span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-indigo-600 transition">Beranda</Link>
          <Link href="/laundry-expert" className="hover:text-indigo-600 transition">Konsultasi</Link>
          <a href="#about" className="hover:text-indigo-600 transition">Tentang</a>
        </div>

        {/* Burger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-indigo-700 text-2xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 flex flex-col items-center py-4 space-y-3">
          <Link
            href="/"
            className="text-gray-700 hover:text-indigo-600 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Beranda
          </Link>
          <Link
            href="/laundry-expert"
            className="text-gray-700 hover:text-indigo-600 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Konsultasi
          </Link>
          <a
            href="#about"
            className="text-gray-700 hover:text-indigo-600 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Tentang
          </a>
        </div>
      )}
    </nav>
  );
}
