// file: src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: `/${string}`; // ✅ ensures href is always a route-like string
  label: string;
};

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/favorites", label: "Favorites" },
  { href: "/settings", label: "Settings" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm border transition
                ${
                  active
                    ? "border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
