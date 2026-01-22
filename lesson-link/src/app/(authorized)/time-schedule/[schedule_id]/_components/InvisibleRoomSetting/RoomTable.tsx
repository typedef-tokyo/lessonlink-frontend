'use client'

import { Table } from '@mantine/core'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import React, { Dispatch, SetStateAction } from 'react'
import { InvisibleRoomItem } from './types'

type Props = {
  rooms: InvisibleRoomItem[]
  setInvisibleRoom: Dispatch<SetStateAction<InvisibleRoomItem[]>>
}

export const RoomTable = ({ rooms, setInvisibleRoom }: Props) => {
  const iconEye = <IconEye className='text-blue-500 group-hover:text-blue-700 cursor-pointer' />
  const iconEyeOff = <IconEyeOff className='text-red-700 group-hover:text-red-600 cursor-pointer' />

  const onHandleClick = (roomIndex: number) => {
    setInvisibleRoom((prev: InvisibleRoomItem[]) =>
      prev.map(room =>
        room.room_index === roomIndex ? { ...room, visible: !room.visible } : room,
      ),
    )
  }

  return (
    <div className='overflow-auto custom-scrollbar flex-grow'>
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className='w-[40%]'>番号</Table.Th>
            <Table.Th className='w-[60%]'>名前</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rooms
            .sort((a, b) => a.room_index - b.room_index)
            .map((room, _) => (
              <Table.Tr key={room.room_index}>
                <Table.Td>
                  <div className='flex'>
                    <div
                      className='flex items-center mr-2'
                      onClick={() => onHandleClick(room.room_index)}
                    >
                      {room.visible ? iconEye : iconEyeOff}
                    </div>
                    <div className='flex items-center'>{room.room_index}</div>
                  </div>
                </Table.Td>
                <Table.Td>{room.room_name}</Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </div>
  )
}
