import React from 'react'

type HeaderProps = {
    children: React.ReactNode
    size: string
}

const Header = ({children, size}: HeaderProps) => {
  return (
    <div className={`font-bold uppercase ${size}`}>{children}</div>
  )
}

export default Header