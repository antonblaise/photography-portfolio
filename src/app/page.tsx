import Link from "next/link";
import "./globals.css"

export default function HomePage() {
  return (
    <main className="p-10 font-light text-xl tracking-widest">
      <h1>Antonius</h1>

      <nav>
        <ul className="text-blue-300">
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/about">About Me</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </main>
  )
}