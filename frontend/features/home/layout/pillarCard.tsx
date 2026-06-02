const pillars = [
  {
    icon: '🔍',
    title: 'Lead Generation & Signals',
    tagline: 'Better data, more wins',
    body: 'Get instant access to our top-quality database. Our data is trusted by industry leaders to reduce bounce rates by 50% and 5x increase in interest rates.',
    accent: 'text-leadgen-red',
  },
  {
    icon: '📬',
    title: 'Multichannel Engagement',
    tagline: 'Maximize buyer engagement',
    body: 'Generic outreach is obsolete. Craft tailored, multichannel sequences to reach buyers on their favorite channels and get up to 100% more replies.',
    accent: 'text-engagement-gold',
  },
  {
    icon: '📨',
    title: 'Deliverability Optimization',
    tagline: 'Hit every inbox, every time',
    body: "Don't let bounces and spam folders derail your efforts. Boost your open rates by up to 50% with AI scheduling, deliverability testing, and smart warmup.",
    accent: 'text-deliver-green',
  },
  {
    icon: '🧠',
    title: 'Intelligence',
    tagline: 'Stop guessing, start growing',
    body: "Tired of unqualified leads? Amplemarket's AI processes millions of unique signals to find your next customer and increase conversion rates by up to 50%.",
    accent: 'text-intelligence-blue',
  },
]

interface PillarCardsProps {
  images?: string[]
}

export default function PillarCards({ images }: PillarCardsProps) {
  return (
    <section className="bg-canvas-white w-full">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <h2 className="text-[44px] leading-[1.1] tracking-[-1.32px] text-midnight-ink font-medium text-center max-w-2xl mx-auto mb-12">
          All-in-one platform to level up your sales process
        </h2>
        <p className="text-center text-base text-muted-ash -mt-8 mb-16">
          Give your team the power to sell smarter and faster from day one.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="rounded-xl bg-canvas-white p-6 md:p-8 shadow-[rgba(17,17,17,0.02)_0px_-6px_6px_0px,rgba(17,17,17,0.01)_0px_-23px_9px_0px] border border-midnight-ink/5"
            >
              <div className="aspect-[16/9] rounded-xl bg-whisper-gray flex items-center justify-center mb-6 border border-midnight-ink/5 overflow-hidden">
                {images?.[i] ? (
                  <img src={images[i]} alt={pillar.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-muted-ash/20 flex items-center justify-center text-2xl">
                    {pillar.icon}
                  </div>
                )}
              </div>
              <h3 className={`text-lg font-bold ${pillar.accent} tracking-widest uppercase text-sm mb-2`}>
                {pillar.title.split(' ')[0]}
              </h3>
              <h4 className="text-xl font-bold text-midnight-ink mb-2">
                {pillar.tagline}
              </h4>
              <p className="text-sm text-muted-ash leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
