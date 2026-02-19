import React from 'react'
import Header from './Header'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='flex flex-col gap-4 px-6 '>
        <div>
         <Header size='text-2xl'>Gymforage</Header>
         <p className='text-neutral-400 mt-4'>The ultimate fitness tracking app designed for tracking and create your own exercises.</p>
        </div>
        <div>
            <Header size='text-md'>Product</Header>
            <div className='text-neutral-400 mt-4'>
             <Link href={'#features'}>Features</Link>
             <p id='#progress'>How it works</p>
             <p id='#'>Features</p>
             </div>
        </div>
        <div>
            <Header size='md'>Categories</Header>
            <div className='text-neutral-400 mt-4'>
            <p>Chest Training</p>
            <p>Back Training</p>
            <p>Leg Training</p>
            <p>Shoulders</p>
            <p>Arms</p>
            </div>
           
        </div>
        <div className='border-t-2 border-neutral-800 py-10 text-center text-neutral-400'>
            <p>© 2026 GymForge. Built for champions. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer