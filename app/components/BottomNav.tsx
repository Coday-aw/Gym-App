"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  IoHomeOutline,
  IoBarbellOutline,
  IoStatsChartOutline,
} from "react-icons/io5";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Workouts",
      href: "/pages/workouts",
      icon: <IoHomeOutline size={24} />,
    },
    {
      title: "Exercises",
      href: "/pages/exercises",
      icon: <IoBarbellOutline size={24} />,
    },
    {
      title: "Progress",
      href: "/pages/progress",
      icon: <IoStatsChartOutline size={24} />,
    },
    {
      title: "Clerk", // Special placeholder
      href: "#",
      icon: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-700/50 pb-safe pb-4 pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto">
        <ul className="flex items-center justify-between px-2">
          {navItems.map((item, index) => {
            if (item.title === "Clerk") {
              return (
                <li key={index} className="flex flex-col items-center justify-center pt-1">
                  <div className="h-9 flex items-center justify-center">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 ring-2 ring-emerald-500/30",
                        },
                      }}
                    />
                  </div>
                  <span className="text-[10px] mt-1 font-medium text-slate-400">Profile</span>
                </li>
              );
            }

            const isActive = pathname === item.href || (item.href !== "/pages/workouts" && pathname.startsWith(item.href));

            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-emerald-400"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 mb-0.5 transition-all ${isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] scale-110" : ""}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-emerald-400 font-semibold" : "text-slate-400"}`}>
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
