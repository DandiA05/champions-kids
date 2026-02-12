"use client";

import { usePathname } from "next/navigation";
import { ConditionalHeader } from "./conditional-header";
import { SiteFooter } from "./site-footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current route is admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  // For admin routes, don't show header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For regular routes, show header/footer
  return (
    <>
      <ConditionalHeader />
      {children}
      <SiteFooter />
      {/* <div id="back-to-top" className="back-to-top">
        <a href="#">
          <i className="fa-solid fa-arrow-up"></i>
        </a>
      </div> */}
    </>
  );
}
