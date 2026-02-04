'use client'
import React from 'react'
import { HeaderMenu } from './HeaderMenu'

const Header = () => {
  return (
    <header className='bg-themeColor h-[9vh] min-h-[73px] justify-between pt-5 pb-5 px-9 flex items-center flex-shrink-0'>
      <div className='w-40'>
        <img src='/images/lessonlink.png' alt='' />
      </div>
      <HeaderMenu />
    </header>
  )
}

export default Header
