"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HSLogomark, HSWordmark } from "@/components/ui";
import { PLAYBOOK, SCREENS } from "@/lib/nav";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // A navigation closes the menu — otherwise the panel stays over the page you
  // just asked for.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname === `${href}/`;

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="harystyles, home">
          <HSLogomark size={24} />
          <HSWordmark size={19} />
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id="site-nav" className={styles.nav} data-open={open}>
          {[...PLAYBOOK, ...SCREENS].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              data-active={isActive(item.href)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/shelf" className={styles.link} data-active={isActive("/shelf")}>
            Shelf
          </Link>
          <Link href="/editor" className={styles.editorLink} data-active={isActive("/editor")}>
            Editor
          </Link>
        </nav>
      </div>
    </header>
  );
}
