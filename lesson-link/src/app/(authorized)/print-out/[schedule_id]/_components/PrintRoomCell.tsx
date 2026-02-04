'use client'

import { DURATIN_UNIT_HOUR } from '@constants/Constants'
import React, { useEffect, useRef, useState } from 'react'
import { PrintHourBlock } from './PrintHourBlock'
import { PrintMaterialTimebar } from './PrintMaterialTimebar'
import { PrintRoomItem } from './types'

type Props = {
  roomIndex: number
  roomItemList: Array<PrintRoomItem>
}

export const PrintRoomCell = ({ roomIndex, roomItemList }: Props) => {
  const parentDivRef = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  const [leftPercent, setLeftPercent] = useState<Record<string, number>>({})
  const [roomCellWidthPer, setRoomCellWidthPer] = useState<Record<string, number>>({})

  useEffect(() => {
    const newWidths: Record<string, number> = {}
    const newLefts: Record<string, number> = {}

    roomItemList
      .filter(roomItem => roomItem.room_index === roomIndex)
      .forEach(roomItem => {
        const startRef = refs.current[roomItem.start_time_index]
        const endRef = refs.current[roomItem.end_time_index]

        if (!startRef || !endRef || !parentDivRef.current) return

        const parentWidth = parentDivRef.current.offsetWidth
        const startLeft =
          startRef.getBoundingClientRect().left - parentDivRef.current.getBoundingClientRect().left
        const endRight =
          endRef.getBoundingClientRect().right - parentDivRef.current.getBoundingClientRect().left

        newLefts[roomItem.uniq_id] = (startLeft / parentWidth) * 100
        const widthPercent = ((endRight - startLeft) / parentWidth) * 100
        newWidths[roomItem.uniq_id] = widthPercent
        roomItem.widthPercent = widthPercent
      })

    setLeftPercent(newLefts)
    setRoomCellWidthPer(newWidths)
  }, [roomItemList, parentDivRef])

  return (
    <div ref={parentDivRef} className='w-[100%] flex relative'>
      {Array.from({ length: DURATIN_UNIT_HOUR }, (_, outerIndex) => (
        <PrintHourBlock key={outerIndex} outerIndex={outerIndex} refs={refs} />
      ))}
      {roomItemList
        .filter(roomItem => roomItem.room_index === roomIndex)
        .map((roomItem, _) => {
          return (
            <div
              key={roomItem.uniq_id}
              className='h-full absolute flex items-center'
              style={{
                left: `${leftPercent[roomItem.uniq_id]}%`,
                width: `${roomCellWidthPer[roomItem.uniq_id]}%`,
              }}
            >
              <PrintMaterialTimebar item={roomItem} />
            </div>
          )
        })}
    </div>
  )
}
