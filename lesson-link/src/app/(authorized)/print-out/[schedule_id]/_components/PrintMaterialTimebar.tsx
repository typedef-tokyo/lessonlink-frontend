'use client'

import { CLEANING_COLOR, LESSON_COLOR } from '@constants/Constants'
import React, { useEffect, useState } from 'react'
import { PrintRoomItem } from './types'

type Props = {
  item: PrintRoomItem
}

export const PrintMaterialTimebar = ({ item }: Props) => {
  const [itemDetailTxt, setItemDetailTxt] = useState('')
  useEffect(() => {
    setItemDetailTxt(`${item.lesson_name} ${item.duration}分`)
  }, [item])

  const color = item.tag === 'lesson' ? LESSON_COLOR : CLEANING_COLOR
  return (
    <div
      className={`flex h-[25px] w-[100%] ${color} justify-between rounded border border-white pl-1 relative z-50`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div
        className={`h-full w-full text-white text-xs items-center mt-1 overflow-hidden text-ellipsis whitespace-nowrap select-none`}
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        {itemDetailTxt}
      </div>
    </div>
  )
}
