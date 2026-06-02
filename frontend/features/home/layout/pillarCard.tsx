import Image from 'next/image'

const profileFeatures = [
  {
    imageSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
    title: 'Emergency Contacts',
    tagline: 'All your loved ones in one place',
    body: 'Your profile keeps a built-in contact list with family numbers and ICE (In Case of Emergency) contacts. No need to switch apps — everything is ready when you need it.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop',
    title: 'Live Family Map',
    tagline: 'See everyone at a glance',
    body: 'Your dashboard shows a live map of all tracked family members. Green markers mean safe, red means help needed — one look and you know the situation.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    title: 'Alert History',
    tagline: 'Stay informed on past incidents',
    body: 'Your profile logs every alert and check-in so you can review the timeline of events. Know what happened, when, and who responded.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
    title: 'Quick Access Tools',
    tagline: 'Emergency tools at your fingertips',
    body: 'From your profile, quickly access the Report button, evacuation maps, contact directory, and safety check-in — everything you need in a crisis.',
  },
]

export default function PillarCards() {
  return (
    <section id="profile" className="scroll-mt-[60px] bg-canvas-white w-full">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <h2 className="text-[44px] leading-[1.1] tracking-[-1.32px] text-midnight-ink font-medium text-center max-w-2xl mx-auto mb-12">
          Your Personal Dashboard
        </h2>
        <p className="text-center text-base text-muted-ash -mt-8 mb-16">
          Everything you need to protect your family, all in one place.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {profileFeatures.map((feature, i) => (
            <div
              key={i}
              className="rounded-xl bg-canvas-white p-6 md:p-8 shadow-[rgba(17,17,17,0.02)_0px_-6px_6px_0px,rgba(17,17,17,0.01)_0px_-23px_9px_0px] border border-midnight-ink/5"
            >
              <div className="aspect-[16/9] rounded-xl bg-whisper-gray flex items-center justify-center mb-6 border border-midnight-ink/5 overflow-hidden">
                <Image src={feature.imageSrc} alt={feature.title} width={600} height={338} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-phoenix-orange tracking-widest uppercase text-sm mb-2">
                {feature.title.toUpperCase().replace(/ /g, ' \u2022 ').split(' \u2022 ')[0]}
              </h3>
              <h4 className="text-xl font-bold text-midnight-ink mb-2">
                {feature.tagline}
              </h4>
              <p className="text-sm text-muted-ash leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
