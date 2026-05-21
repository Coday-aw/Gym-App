"use client"
import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Footer from './components/Footer'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function Home() {
  const router = useRouter()
  const {user} = useUser()

  useEffect(() => {
    if (user) {
      router.push('/pages/workouts')
    }
  }, [user, router])
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Footer/>
    </main>
  )
}

