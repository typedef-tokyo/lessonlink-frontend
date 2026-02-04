'use client'

import { LESSON_COLOR_CODE } from '@constants/Constants'
import React from 'react'

type Props = {
  name: string
  invisibleRoomOpen: () => void
  isDisableClick: boolean
}

export const TaskLabel = ({ name, invisibleRoomOpen, isDisableClick }: Props) => {
  return (
    <div style={{ width: `100%` }} className={`flex bg-white`}>
      <div className={`bg-white items-center sticky left-0 z-[100] `}>
        <div className='w-full min-w-[120px] flex-1 flex sticky left-0'>
          <div className='bg-white w-full h-full flex relative items-center justify-end'>
            <div
              className={`relative ${!isDisableClick ? 'cursor-pointer' : ''}`}
              onClick={!isDisableClick ? () => invisibleRoomOpen() : undefined}
            >
              <svg
                width='92'
                height='33'
                viewBox='0 0 92 33'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  id='Union'
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M79.1903 1.30931C78.4322 0.475411 77.3575 0 76.2305 0H4C1.79086 0 0 1.79086 0 4V29C0 31.2091 1.79086 33 4 33H76.2305C77.3575 33 78.4322 32.5246 79.1903 31.6907L90.5539 19.1907C91.9409 17.665 91.9409 15.335 90.5539 13.8093L79.1903 1.30931Z'
                  fill={LESSON_COLOR_CODE}
                />
              </svg>
              <div className="flex items-center justify-center text-center text-white text-sm font-semibold font-['Hiragino Kaku Gothic Pro'] leading-snug tracking-wide w-full h-full absolute top-0 left-0 pr-2.5">
                {name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
