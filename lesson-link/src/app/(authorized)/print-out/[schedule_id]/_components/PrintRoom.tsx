'use client'

import React from 'react'
import { PrintRoomCell } from './PrintRoomCell'
import { PrintRoomItem } from './types'

type Props = {
  roomIndex: number
  roomName: string
  roomItemList: Array<PrintRoomItem>
  visible: boolean
}

export const PrintRoom = ({ roomIndex, roomName, roomItemList, visible }: Props) => {
  return (
    <div
      className={`min-h-[45px] flex bg-white text-xs text-black`}
      style={{
        ...(visible === false ? { display: 'none' } : {}),
        width: `99vw`,
      }}
    >
      <div
        className={`bg-white min-h-[45px] truncate flex items-center justify-center sticky left-0 z-[100]`}
        style={{ width: `5%` }}
      >
        <div className='w-[100%] ml-1 truncate select-none' title={roomName}>
          {roomName}
        </div>
      </div>
      <PrintRoomCell roomIndex={roomIndex} roomItemList={roomItemList} />
    </div>
  )
}
