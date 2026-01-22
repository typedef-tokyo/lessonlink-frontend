'use client'

import { IconLabelFilled } from '@tabler/icons-react'
import React from 'react'

type Props = {
  name: string
}

export const PrintTaskLabel = ({ name }: Props) => {
  return (
    <div className={`flex mt-5 mb-2 ml-2`}>
      <div className={`bg-white items-center z-[100] `}>
        <div className='w-full flex-1 flex'>
          <div className='bg-cyan-400 w-full h-full flex relative items-center justify-end'>
            <div
              className='flex items-center justify-center text-center text-white text-sm font-semibold leading-snug tracking-wide w-full h-full my-2 mx-3'
              style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            >
              {name}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
