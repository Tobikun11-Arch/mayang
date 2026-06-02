import React from 'react'
import Footer from '@/features/home/layout/Footer'
import NavBar from '@/features/home/layout/navBar'
import Hero from '@/features/home/components/Hero'
import CommunityAbout from '@/features/home/layout/CommunityAbout'
import ReportSection from '@/features/home/layout/ReportSection'
import About from '@/features/home/layout/About'
import PillarCards from '@/features/home/layout/pillarCard'

export default function Homepage() {
  return (
    
    <div className="flex min-h-screen flex-col bg-canvas-white text-midnight-ink font-nunito px-6">
    <NavBar />
    <Hero />
    <CommunityAbout />
    <ReportSection />
    <About />
    <PillarCards />
    <Footer />
    </div>
  )
}
