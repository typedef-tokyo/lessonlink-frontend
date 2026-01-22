'use client'

import { Button } from '@mantine/core'
import React, { useState } from 'react'
import { schemas } from '@/generated/api'
import { RoomTable } from './RoomTable'
import { InvisibleRoomItem } from './types'

type Props = {
  rooms: Zod.infer<typeof schemas.presenter_ScheduleRoomDTO>[]
  handleOnInvisibleRoomSave: (list: number[]) => void
}

export const RoomTemplate = ({ rooms, handleOnInvisibleRoomSave }: Props) => {
  const roomIndexes: InvisibleRoomItem[] = rooms.map(item => ({
    room_index: item.room_index,
    room_name: item.room_name,
    visible: item.visible,
  }))

  const [invisibleRoom, setInvisibleRoom] = useState([...roomIndexes])

  const onSaveInvisibleRoom = () => {
    const invisibleData = invisibleRoom.filter(item => !item.visible).map(item => item.room_index)
    handleOnInvisibleRoomSave(invisibleData)
  }

  return (
    <div className='flex flex-col mb-5 ml-14 mr-14 flex-grow'>
      <div className='flex flex-col mt-8 w-max-[40%] justify-center'>
        <div className='flex justify-between items-end'>
          <div>
            <div className="text-[#222222] text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
              ルーム非表示設定
            </div>
          </div>
          <Button
            className='bg-themeColor hover:bg-hoverThemeColor rounded'
            type='button'
            onClick={() => onSaveInvisibleRoom()}
          >
            <div className="text-center text-white text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
              保存
            </div>
          </Button>
        </div>

        <div className='flex mt-8 w-max-[80%] justify-center'>
          <div className='flex-grow min-w-[140px]'>
            <div className='bg-themeColor flex justify-center border-b border-gray-300 p-2 mb-5 text-white'>
              講座
            </div>
            <RoomTable rooms={invisibleRoom} setInvisibleRoom={setInvisibleRoom} />
          </div>
        </div>
      </div>
    </div>
  )
}
