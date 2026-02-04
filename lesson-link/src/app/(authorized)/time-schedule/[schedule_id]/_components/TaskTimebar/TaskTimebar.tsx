'use client'

import React from 'react'
import { TaskTime } from './TaskTime'

type Props = {
  maxTimeMinutes: number
}

export const TaskTimebar = ({ maxTimeMinutes }: Props) => {
  const totalHour = Math.ceil(maxTimeMinutes / 60)

  return (
    <div className='w-[100%] flex items-center bg-[#7a7a7a] text-xs text-white'>
      {Array.from({ length: totalHour }, (_, i) => (
        <React.Fragment key={i}>
          <TaskTime time={`${i + 1}H`} />
          {i < totalHour - 1 && '|'}
        </React.Fragment>
      ))}
    </div>
  )
}
