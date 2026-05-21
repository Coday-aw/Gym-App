"use client";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { navLinks } from "../lib/data";
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-4">
      <Link href="/" className="font-black text-2xl tracking-tight">
        <span className="gradient-text">GYM</span>
        <span className="text-slate-100">FORAGE</span>
      </Link>

      <button
        className="relative z-50 text-slate-300 hover:text-white transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <IoClose size={28} /> : <GiHamburgerMenu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-30 modal-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 w-72 h-full z-40 glass border-l border-slate-700/50 p-8 pt-20 animate-slide-down">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-white py-3 px-4 rounded-xl hover:bg-slate-800/50 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="block text-center py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
