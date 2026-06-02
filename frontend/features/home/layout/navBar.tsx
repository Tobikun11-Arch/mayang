import Image from 'next/image'
import React from 'react'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-canvas-white font-labil-grotesk shadow-[rgba(17,17,17,0.05)_0px_0px_1px_0px,rgba(17,17,17,0.04)_1px_1px_1px_0px,rgba(17,17,17,0.03)_2px_3px_2px_0px,rgba(17,17,17,0.01)_4px_4px_2px_0px] w-full">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="inline-flex items-center gap-4 text-lg font-bold text-midnight-ink tracking-tight">
            <Image src="/mayang.png" alt="Mayang" width={44} height={44} className="object-contain" />
            <span className="text-black"></span>
          </span>
          <nav className="hidden md:flex items-center gap-4">
            {['Product', 'Why us', 'Resources', 'Customers', 'Pricing'].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-2 text-sm text-muted-ash hover:text-phoenix-orange transition-colors rounded-lg"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-canvas-white bg-phoenix-orange rounded-lg hover:opacity-90 transition-opacity"
          >
            Login
          </a>
          <button className="md:hidden ml-2 text-midnight-ink" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
