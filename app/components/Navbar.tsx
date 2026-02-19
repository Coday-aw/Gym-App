"use client";
import { GiHamburgerMenu } from "react-icons/gi";
import { navLinks } from "../lib/data";
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between border-b border-b-neutral-800 p-4 text-white">
      <h1 className="font-bold text-2xl">GYMFORAGE</h1>
      <div className="transition-transform duration-300 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <GiHamburgerMenu size={30} />
      </div>
      { isOpen && (
        <div className="absolute top-16 left-0 w-full right-0 bg-neutral-900 p-4 rounded">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="block py-2 text-lg">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
