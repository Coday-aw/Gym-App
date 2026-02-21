import React from 'react'
import Header from '../components/Header'

type LayoutProps = {
    children: React.ReactNode
}

 function Layout({children}: LayoutProps) {
  return (
    <div className='p-4'>
        <Header/>
        {children}
    </div>
  )
}

export default Layout

