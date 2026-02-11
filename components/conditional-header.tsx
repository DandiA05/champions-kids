"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return <SiteHeader isHomePage={isHomePage} />;
}
