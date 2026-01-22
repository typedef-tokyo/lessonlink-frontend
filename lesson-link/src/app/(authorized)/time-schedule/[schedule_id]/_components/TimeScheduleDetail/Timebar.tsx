'use client'

import { COLUMN_HEADER_WIDTH } from '@constants/Constants'
import React from 'react'
import { Time } from './Time'

type Props = {
  zoom: number
  scheduleStartTime: number
  scheduleEndTime: number
}

const generateTimeRange = (start: number, end: number): string[] => {
  return Array.from({ length: end - start }, (_, i) => {
    const hour = (start + i) % 24
    return hour.toString().padStart(2, '0') + ':00'
  })
}

export const Timebar = ({ zoom, scheduleStartTime, scheduleEndTime }: Props) => {
  const times = generateTimeRange(scheduleStartTime, scheduleEndTime)

  return (
    <div
      style={{ width: `${zoom}%` }}
      className={`h-[2vh] sticky top-0 z-[51] flex items-center bg-[#FFFFFF] text-xs text-white`}
    >
      <div
        className={`bg-white h-full flex items-center sticky left-0 z-[100]`}
        style={{ width: `${COLUMN_HEADER_WIDTH}px` }}
      >
        <div className={`ml-3 truncate select-none`} style={{ width: `${COLUMN_HEADER_WIDTH}px` }}>
          &nbsp;
        </div>
      </div>
      {times.map(time => (
        <Time key={`${scheduleStartTime}-${time}`} time={time} />
      ))}
    </div>
  )
}
