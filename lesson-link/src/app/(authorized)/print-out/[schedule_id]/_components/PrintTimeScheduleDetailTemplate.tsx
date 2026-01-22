'use client'

import React from 'react'
import { schemas } from '@/generated/api'
import { PrintRoom } from './PrintRoom'
import { PrintTaskLabel } from './PrintTaskLabel'
import { PrintTimebar } from './PrintTimebar'
import { PrintRoomItem } from './types'

type Props = {
  roomItemList: Array<PrintRoomItem>
  rooms: Zod.infer<typeof schemas.presenter_ScheduleRoomDTO>[]
  startHH: number
}

export const PrintTimeScheduleDetailTemplate = ({ roomItemList, rooms, startHH }: Props) => {
  const sortedRooms = rooms.sort((a, b) => a.room_index - b.room_index)

  return (
    <>
      <style>
        {`
      @media print {
        .print-section {
          page-break-before: always;
        }
      }
    `}
      </style>
      <div className='print-section'>
        <div className='bg-white w-full flex-1 min-h-[80%] h-auto flex flex-col'>
          <div className='bg-white w-full h-[96%] flex overflow-visible'>
            <div className='bg-white w-full h-full flex flex-col pb-2'>
              <PrintTaskLabel name='講座' />
              <PrintTimebar startHH={startHH} />
              {sortedRooms.map(room => (
                <PrintRoom
                  key={`${room.room_index}}`}
                  roomIndex={room.room_index}
                  roomName={room.room_name}
                  roomItemList={roomItemList}
                  visible={room.visible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
