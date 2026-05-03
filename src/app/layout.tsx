import React from "react"
import Link from "next/link"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="
          tracking-widest
          flex
          flex-row
          pt-10
          pr-20
          gap-20
          justify-end
          [&>a]:hover:text-gray-400
          [&>a]:hover:duration-500
        ">
          <Link href="/">Home</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">About Me</Link>
          <Link href="contact">Contact</Link>
        </nav>

        {children}
      </body>
    </html>
  )
}

