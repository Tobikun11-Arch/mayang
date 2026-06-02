"use client"

import Image from 'next/image'
import React, { useState } from 'react'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-canvas-white font-nunito shadow-[rgba(17,17,17,0.05)_0px_0px_1px_0px,rgba(17,17,17,0.04)_1px_1px_1px_0px,rgba(17,17,17,0.03)_2px_3px_2px_0px,rgba(17,17,17,0.01)_4px_4px_2px_0px] w-full">
      <div className="relative mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        <span className="inline-flex items-center text-base font-medium text-midnight-ink tracking-tight leading-none">
          <span className="leading-none text-xl -mb-1">M</span>
          <Image src="/maya_orange.png" alt="Mayang" width={24} height={24} className="object-contain" />
          <span className="leading-none text-xl -mb-1">YANG</span>
        </span>

        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
          {[
            { label: 'Community', href: '#community' },
            { label: 'Report', href: '#report' },
            { label: 'Family', href: '#family' },
            { label: 'Profile', href: '#profile' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm text-muted-ash hover:text-phoenix-orange transition-colors rounded-lg"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-canvas-white bg-phoenix-orange rounded-lg hover:opacity-90 transition-opacity"
          >
            Login
          </a>
          <button
            className="md:hidden ml-2 text-midnight-ink"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-canvas-white border-t border-midnight-ink/5 px-6 py-4">
          <nav className="flex flex-col gap-2">
            {[
              { label: 'Community', href: '#community' },
              { label: 'Report', href: '#report' },
              { label: 'Family', href: '#family' },
              { label: 'Profile', href: '#profile' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm text-muted-ash hover:text-phoenix-orange transition-colors rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#"
              className="mt-2 inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-canvas-white bg-phoenix-orange rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
