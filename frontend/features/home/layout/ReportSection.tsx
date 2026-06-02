import { MapPin, AlertTriangle, ShieldCheck, Camera } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const featureIcons = [MapPin, AlertTriangle, ShieldCheck, Camera]
const features = [
  { text: 'Real-time pin drop location' },
  { text: 'Instant community-wide alert' },
  { text: 'Verified by response team in minutes' },
  { text: 'Attach photos and description' },
]

export default function ReportSection() {
  return (
    <section id="report" className="scroll-mt-[60px] w-full bg-[#ffffff]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[44px] leading-[1.1] tracking-[-1.32px] text-midnight-ink font-medium">
            Report an Incident
          </h2>
          <p className="mt-4 text-base text-muted-ash leading-relaxed">
            See something? Say something. Every report helps protect your community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-xl overflow-hidden shadow-[rgba(17,17,17,0.05)_0px_0px_1px_0px,rgba(17,17,17,0.04)_1px_1px_1px_0px,rgba(17,17,17,0.03)_2px_3px_2px_0px,rgba(17,17,17,0.01)_4px_4px_2px_0px]">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=500&fit=crop"
              alt="Global digital map and communication network"
              width={600}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <ul className="space-y-5">
              {features.map((f, i) => {
                const Icon = featureIcons[i]
                return (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-phoenix-orange flex-shrink-0">
                      <Icon size={24} />
                    </span>
                    <span className="text-base text-midnight-ink font-medium leading-relaxed pt-1">
                      {f.text}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1,247', label: 'Active Reports Today' },
            { value: '892', label: 'Community Alerts Sent' },
            { value: '4,561', label: 'Verified Safe' },
            { value: '12', label: ' min avg. response time' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl bg-whisper-gray p-6 text-center"
            >
              <p className="text-[32px] leading-[1] font-bold text-phoenix-orange mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-ash">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
