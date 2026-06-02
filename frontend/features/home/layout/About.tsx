import React from 'react'

const values = [
  {
    icon: '📦',
    title: 'Dedicated returns specialists',
    body: 'We focus exclusively on returns management, providing in-depth solutions that drive real business results others can\'t match.',
  },
  {
    icon: '🎧',
    title: 'Exceptional customer support',
    body: 'We don\'t outsource support — you\'ll work directly with specialists who understand your business and are ready to help whenever you need it.',
  },
  {
    icon: '🌍',
    title: 'Effortless global expansion',
    body: 'We handle customs, multi-language support, multi-location returns, and compliance with international regulations, simplifying your global growth.',
  },
]

export default function About() {
  return (
    <section className="w-full bg-[#ffffff]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-start">
          <div>
            <h2 className="text-[48px] md:text-[56px] text-[#051923] leading-[1.07] font-bold mb-6" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Leading returns solution for <span className="text-phoenix-orange">international brands</span>
            </h2>
            <p className="text-[14px] text-[#525252] leading-[1.54] tracking-[0.05px] max-w-lg" style={{ fontFamily: 'system-ui, sans-serif' }}>
              At 8returns, we&apos;ve been in your shoes. Our founders and investors have scaled successful e-commerce companies, giving us firsthand understanding of your challenges and the ability to create solutions that truly meet your needs.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-phoenix-orange hover:underline"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Learn more about us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-[16px] bg-cyan-glow/30 flex items-center justify-center text-[32px]">👥</div>
            <div className="aspect-square rounded-[16px] bg-[#eef0f2] flex items-center justify-center text-[32px]">💼</div>
            <div className="aspect-square rounded-[16px] bg-[#eef0f2] flex items-center justify-center text-[32px]">🤝</div>
            <div className="aspect-square rounded-[16px] bg-phoenix-orange/20 flex items-center justify-center text-[32px]">✨</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col gap-4">
              <span className="text-[32px]">{v.icon}</span>
              <h3 className="text-[22px] text-[#051923] leading-[1.27] font-semibold" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {v.title}
              </h3>
              <p className="text-[14px] text-[#525252] leading-[1.54] tracking-[0.05px]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

