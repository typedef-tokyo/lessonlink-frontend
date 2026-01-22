'use client'

import React from 'react'

type Props = {
  time: string
}

export const TaskTime = ({ time }: Props) => {
  return (
    <div className='flex-1 h-full flex items-center justify-center text-xs text-white'>{time}</div>
  )
}
