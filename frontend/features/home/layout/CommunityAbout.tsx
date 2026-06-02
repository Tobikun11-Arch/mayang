import Image from 'next/image'
import React from 'react'

const communityValues = [
  {
    imageSrc: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop',
    title: 'Connected Communities',
    body: 'Mayang brings neighbors together by providing a shared platform where communities can track each other\'s safety, share real-time updates, and coordinate response efforts during disasters.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    title: 'Real-Time Community Alerts',
    body: 'Community members can report incidents and broadcast warnings instantly. When one person spots danger, the whole community knows within seconds.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
    title: 'Collective Safety Network',
    body: 'Safety is a shared responsibility. Mayang empowers every member to look out for one another, creating a resilient network where no one is left behind.',
  },
  {
    imageSrc: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
    title: 'Local Knowledge Hub',
    body: 'Community members contribute critical local information — from accessible evacuation routes to nearby shelters — ensuring everyone has the knowledge they need to stay safe.',
  },
]

export default function CommunityAbout() {
  return (
    <section id="community" className="scroll-mt-[60px] w-full bg-[#ffffff]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[44px] leading-[1.1] tracking-[-1.32px] text-midnight-ink font-medium">
            A Community That Cares
          </h2>
          <p className="mt-4 text-base text-muted-ash leading-relaxed">
            Mayang is built on the belief that strong communities are the foundation of disaster resilience. Together, we prepare, respond, and recover.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityValues.map((item, i) => (
            <div
              key={i}
              className="rounded-xl bg-canvas-white p-6 border border-midnight-ink/5 shadow-[rgba(17,17,17,0.02)_0px_-6px_6px_0px,rgba(17,17,17,0.01)_0px_-23px_9px_0px]"
            >
              <Image src={item.imageSrc} alt={item.title} width={600} height={400} className="w-full aspect-video rounded-lg object-cover mb-4" />
              <h3 className="text-lg font-semibold text-midnight-ink mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-ash leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
