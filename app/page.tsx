import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className='bg-neutral-950 min-h-screen text-white'>
      <Navbar />
      <HeroSection />
      <Footer/>
    </main>
  )
}

