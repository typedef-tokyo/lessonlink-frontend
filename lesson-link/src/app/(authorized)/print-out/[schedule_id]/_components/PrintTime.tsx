'use client'

import React from 'react'

type Props = {
  time: number
}

export const PrintTime = ({ time }: Props) => {
  const displayTime = time % 24
  return (
    <div
      className='flex-1 h-full flex items-center bg-[#7a7a7a] border-r-[1px] border-[#FFFFFF]'
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div
        className='w-full h-full flex items-center justify-center text-xs text-white'
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        {displayTime < 24 ? `${displayTime.toString().padStart(2, '0')}:00` : ''}
      </div>
    </div>
  )
}
