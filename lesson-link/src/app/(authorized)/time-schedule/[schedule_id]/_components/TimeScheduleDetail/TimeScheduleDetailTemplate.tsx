'use client'

import { Slider } from '@mantine/core'
import React, { useRef, useState } from 'react'
import { schemas } from '@/generated/api'
import { CleaningItem, DraggingInfo, ItemPayload, RoomItem } from '../../../types'
import { ActivityTimebar, DefaultCleaningItem } from '../ActivityTimebar'
import {
  ItemDivideValues,
  ItemJoinValues,
  ItemMoveValues,
  ItemReturnListValues,
  ItemShiftValues,
} from '../TimeScheduleTemplate'
import { Room } from './Room'
import { TaskLabel } from './TaskLabel'
import { Timebar } from './Timebar'

type Props = {
  roomItemList: Array<RoomItem>
  rooms: Zod.infer<typeof schemas.presenter_ScheduleRoomDTO>[]
  update: (payload: ItemPayload | ItemPayload[]) => void
  isDragging: boolean
  setIsDragging: (args: { flag: boolean }) => void
  draggingInfo: DraggingInfo | null
  handleDrag: (payload: DraggingInfo) => void
  isDeviding: boolean | string
  setIsDeviding: (state: false | string) => void
  timeIndex: { startIndex: number; endIndex: number }
  setBandleTimeIndex: (startIndex: number, endIndex: number) => void
  isDisableClick: boolean
  scheduleStartTime: number
  scheduleEndTime: number
  invisibleRoomOpen: () => void
  onItemMoveUpdate: (values: ItemMoveValues) => void
  onItemReturnListUpdate: (values: ItemReturnListValues) => void
  onItemDeivde: (values: ItemDivideValues) => void
  onItemJoin: (values: ItemJoinValues) => void
  onItemShift: (values: ItemShiftValues) => void
}

export const TimeScheduleDetail = ({
  roomItemList,
  rooms,
  update,
  isDragging,
  setIsDragging,
  draggingInfo,
  handleDrag,
  isDeviding,
  setIsDeviding,
  timeIndex,
  isDisableClick,
  scheduleStartTime,
  scheduleEndTime,
  invisibleRoomOpen,
  onItemMoveUpdate,
  onItemReturnListUpdate,
  onItemDeivde,
  onItemJoin,
  onItemShift,
}: Props) => {
  const rawWorkTime = scheduleEndTime - scheduleStartTime
  const workTime = Math.max(rawWorkTime, 10)

  const sliderMin = workTime * 10
  const sliderMax = sliderMin * 10
  const sliderInitial = sliderMin

  const [zoom, setZoom] = useState(sliderInitial)
  const parentRef = useRef<HTMLDivElement>(null)
  const parentRefLesson = useRef<HTMLDivElement>(null)

  const sortedRooms = rooms.sort((a, b) => a.room_index - b.room_index)

  const cleaningItem: CleaningItem = {
    ...DefaultCleaningItem,
    duration: 10,
    duration_time_unit_count: 10,
  }

  return (
    <div className='bg-white w-full flex-1 h-auto flex flex-col' ref={parentRef}>
      <div className='bg-white w-full h-[96%] flex overflow-x-scroll' ref={parentRefLesson}>
        <div style={{ width: `${zoom}%` }} className='bg-white w-full h-full flex flex-col pb-2'>
          <Timebar
            key={`timebar-${scheduleStartTime}`}
            zoom={zoom}
            scheduleStartTime={scheduleStartTime}
            scheduleEndTime={scheduleEndTime}
          />
          <div style={{ width: `${zoom}%` }} className='w-full flex flex-1 bg-white'>
            <TaskLabel
              name='講座'
              invisibleRoomOpen={invisibleRoomOpen}
              isDisableClick={isDisableClick}
            />
            <div
              className={`w-[124px] flex items-center justify-between right-2 sticky z-[51] bg-white mt-1 mb-1`}
            >
              <div className='flex-1'>
                <ActivityTimebar
                  item={cleaningItem}
                  update={update}
                  setIsDragging={setIsDragging}
                  widthPercent={100}
                  handleDrag={handleDrag}
                  timeLineParentWidth={-1}
                  updateRoomCellWidth={null}
                  timeIndex={timeIndex}
                  isDisableClick={isDisableClick}
                  scheduleStartTimeHH={scheduleStartTime}
                  maxEndTimeIndex={null}
                  onItemMoveUpdate={onItemMoveUpdate}
                />
              </div>
            </div>
          </div>
          {sortedRooms.map(room => (
            <Room
              key={`${room.room_index}}`}
              roomIndex={room.room_index}
              roomName={room.room_name}
              roomItemList={roomItemList}
              update={update}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              draggingInfo={draggingInfo}
              handleDrag={handleDrag}
              isDeviding={isDeviding}
              setIsDeviding={setIsDeviding}
              parentRef={parentRef}
              zoom={zoom}
              timeIndex={timeIndex}
              isDisableClick={isDisableClick}
              scheduleStartTime={scheduleStartTime}
              scheduleEndTime={scheduleEndTime}
              itemStartTime={scheduleStartTime}
              visible={room.visible}
              onItemMoveUpdate={onItemMoveUpdate}
              onItemReturnListUpdate={onItemReturnListUpdate}
              onItemDeivde={onItemDeivde}
              onItemJoin={onItemJoin}
              onItemShift={onItemShift}
            />
          ))}
        </div>
      </div>
      <div className='bg-white w-full h-[4%] flex justify-end items-center pr-6 mb-1'>
        <Slider
          className='w-[30%]'
          color='#8721db'
          value={zoom}
          onChange={setZoom}
          min={sliderMin}
          max={sliderMax}
          label={null}
        />
      </div>
    </div>
  )
}
