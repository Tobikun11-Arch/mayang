import Image from 'next/image'
import React from 'react'

const familyFeatures = [
  {
    imageSrc: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop',
    title: 'Family Location Tracking',
    body: 'See where your loved ones are in real time. Mayang displays every family member\'s location on a shared map so you always know they are safe or on the move.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
    title: 'Safety Check-Ins',
    body: 'Family members can tap a button to broadcast that they are safe. GPS verification and timestamps give you confidence that everyone is accounted for.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&h=400&fit=crop',
    title: 'Remote Family Updates',
    body: 'Even when family members are far away, Mayang keeps you informed with real-time status updates, news, and alerts about their area.',
  },
]

export default function About() {
  return (
    <section id="family" className="scroll-mt-[60px] w-full bg-[#ffffff]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[44px] leading-[1.1] tracking-[-1.32px] text-midnight-ink font-medium">
            Keep Your Family Safe
          </h2>
          <p className="mt-4 text-base text-muted-ash leading-relaxed">
            Nothing matters more than knowing your family is safe. Mayang gives you the tools to track, check in, and stay connected with every member of your household.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {familyFeatures.map((feature, i) => (
            <div
              key={i}
              className="rounded-xl bg-canvas-white p-6 md:p-8 border border-midnight-ink/5 shadow-[rgba(17,17,17,0.02)_0px_-6px_6px_0px,rgba(17,17,17,0.01)_0px_-23px_9px_0px]"
            >
              <Image src={feature.imageSrc} alt={feature.title} width={600} height={400} className="w-full aspect-video rounded-lg object-cover mb-4" />
              <h3 className="text-lg font-semibold text-midnight-ink mb-2">
                {feature.title}
              </h3>
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
