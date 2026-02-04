'use client'

import { HOUR_UNIT } from '@constants/Constants'
import React, { memo } from 'react'

type Props = {
  outerIndex: number
  index: number
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>
}

export const MinutesBlock = memo(({ outerIndex, index, refs }: Props) => {
  return (
    <div
      key={index}
      ref={el => {
        if (refs.current) {
          refs.current[outerIndex * HOUR_UNIT + index] = el
        }
      }}
      className='flex-1 h-full bg-[#f8f8f8] border border-[#D3D3D3] border-opacity-20'
    ></div>
  )
})
