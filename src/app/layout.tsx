import React from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="
          tracking-widest
          flex
          flex-row

          /* Mobile*/
          pt-5
          text-xs
          justify-center

          /* Desktop */
          md:pr-20
          md:pt-5
          md:gap-20
          md:text-base
          md:justify-end

          /* Hover effects */
          [&>a]:hover:text-gray-400
          [&>a]:hover:duration-500

          /* Expand clickable region */
          [&>a]:px-5
          [&>a]:py-5
        ">
          <Link href="/">Home</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">About Me</Link>
          <Link href="contact">Contact</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}

