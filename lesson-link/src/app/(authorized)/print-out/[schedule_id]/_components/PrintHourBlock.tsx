'use client'

import { HOUR_UNIT } from '@constants/Constants'
import React, { memo } from 'react'

type Props = {
  outerIndex: number
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>
}
export const PrintHourBlock = memo(({ outerIndex, refs }: Props) => {
  return (
    <div
      key={outerIndex}
      className='bg-[#f8f8f8] flex-1 h-full flex outline outline-1 outline-[#D3D3D3]'
    >
      {Array.from({ length: HOUR_UNIT }, (_, index) => (
        <div
          key={index}
          ref={el => {
            if (refs.current) {
              refs.current[outerIndex * HOUR_UNIT + index] = el
            }
          }}
          className='flex-1 h-full bg-[#f8f8f8]'
        ></div>
      ))}
    </div>
  )
})
