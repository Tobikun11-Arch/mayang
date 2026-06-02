import React from 'react'

const footerLinks = {
  Resources: ['Preparedness Guides', 'Emergency Kits', 'Safety Tips', 'Disaster FAQ'],
  Help: ['Report an Issue', 'Contact Response Team', 'Community Forum', 'Technical Support'],
  About: ['Our Mission', 'Partners', 'Privacy Policy', 'Terms of Service'],
}

export default function Footer() {
  return (
    <footer className="bg-near-black w-full border-t border-stone/20">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-pure-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-graphite hover:text-cyan-glow transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-medium text-pure-white tracking-tight">
            <span className="text-white">MAY</span>ANG
          </span>
          <p className="text-sm text-graphite">
            &copy; 2026 Mayang. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
 