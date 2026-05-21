"use client";
import Link from "next/link";
import { pageLinks } from "../lib/data";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  const pathname = usePathname();
  return (
    <nav className="glass rounded-2xl p-2 flex items-center justify-between">
      <ul className="flex flex-row gap-1 flex-1">
        {pageLinks.map((link, index) => (
          <li key={index} className="flex-1">
            <Link
              href={link.href}
              className={`flex flex-col justify-center items-center py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                pathname === link.href
                  ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span className="text-lg mb-0.5">{link.icon}</span>
              <span className="text-xs tracking-wider uppercase">{link.title}</span>
              {pathname === link.href && (
                <div className="h-0.5 w-6 mt-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="ml-3 mr-2">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-emerald-500/30",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Header;
