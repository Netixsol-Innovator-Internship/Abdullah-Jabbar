// file: src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Correctly typed routes (as const so TS infers literal types)
const links = [
  { href: "/" as const, label: "Home" },
  { href: "/favorites" as const, label: "Favorites" },
  { href: "/settings" as const, label: "Settings" },
] as const;

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
                className={`px-3 py-1.5 rounded-lg text-sm border transition dark:text-white
                ${active
                  ? "border-indigo-500 text-indigo-700 dark:text-indigo-400"
                  : "border-transparent hover:border-gray-300  dark:hover:border-gray-700"}`}
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
