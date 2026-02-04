'use client'

import { DURATIN_UNIT_HOUR } from '@constants/Constants'
import React from 'react'
import { PrintTime } from './PrintTime'

type Props = {
  startHH: number
}

export const PrintTimebar = ({ startHH }: Props) => {
  return (
    <div
      className={`h-[1.3vw] z-[51] flex items-center bg-[#FFFFFF] text-xs text-white`}
      style={{ width: `99vw`, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div className={`sticky left-0 h-full bg-white`} style={{ width: `4.8%` }}>
        &nbsp;
      </div>
      {Array.from({ length: DURATIN_UNIT_HOUR }, (_, index) => {
        return <PrintTime key={index + startHH} time={index + startHH} />
      })}
    </div>
  )
}
