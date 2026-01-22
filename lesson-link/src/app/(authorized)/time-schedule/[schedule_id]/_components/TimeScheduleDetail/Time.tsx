'use client'

import React from 'react'

type Props = {
  time: string
}

export const Time = ({ time }: Props) => {
  return (
    <div className={`flex-1 h-full flex items-center bg-[#7a7a7a] border-r-[1px] border-[#FFFFFF]`}>
      <div className='w-full h-full flex items-center justify-center text-xs text-white'>
        {time}
      </div>
    </div>
  )
}
