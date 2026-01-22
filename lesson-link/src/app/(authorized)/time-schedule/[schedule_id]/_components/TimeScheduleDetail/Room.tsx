'use client'

import { COLUMN_HEADER_WIDTH } from '@constants/Constants'
import { IconArrowBarToLeft } from '@tabler/icons-react'
import React, { useRef } from 'react'
import { calcEndTimeHH, calcEndTimeMM, calcStartTimeHH, calcStartTimeMM } from '@/app/lib/util'
import { DraggingInfo, ItemPayload, RoomItem } from '../../../types'
import {
  ItemDivideValues,
  ItemJoinValues,
  ItemMoveValues,
  ItemReturnListValues,
  ItemShiftValues,
} from '../TimeScheduleTemplate'
import { RoomCell } from './RoomCell'

type Props = {
  roomIndex: number
  roomName: string
  roomItemList: Array<RoomItem>
  update: (payload: ItemPayload | ItemPayload[]) => void
  isDragging: boolean
  setIsDragging: (args: { flag: boolean }) => void
  draggingInfo: DraggingInfo | null
  handleDrag: (payload: DraggingInfo) => void
  isDeviding: boolean | string
  setIsDeviding: (state: false | string) => void
  parentRef: React.RefObject<HTMLDivElement>
  zoom: number
  timeIndex: { startIndex: number; endIndex: number }
  isDisableClick: boolean
  scheduleStartTime: number
  scheduleEndTime: number
  itemStartTime: number
  visible: boolean
  onItemMoveUpdate: (values: ItemMoveValues) => void
  onItemReturnListUpdate: (values: ItemReturnListValues) => void
  onItemDeivde: (values: ItemDivideValues) => void
  onItemJoin: (values: ItemJoinValues) => void
  onItemShift: (values: ItemShiftValues) => void
}

export const Room = ({
  roomIndex,
  roomName,
  roomItemList,
  update,
  isDragging,
  setIsDragging,
  draggingInfo,
  handleDrag,
  isDeviding,
  setIsDeviding,
  parentRef,
  zoom,
  timeIndex,
  isDisableClick,
  scheduleStartTime,
  scheduleEndTime,
  itemStartTime,
  visible,
  onItemMoveUpdate,
  onItemReturnListUpdate,
  onItemDeivde,
  onItemJoin,
  onItemShift,
}: Props) => {
  const rowHeaderRef = useRef<HTMLDivElement>(null)

  let startTime = Math.abs(scheduleStartTime - itemStartTime)

  const maxEndTimeIndex = 60 * 24 - 1 + startTime * 60

  const shiftExec = (roomIndex: number) => {
    const items = roomItemList.filter(item => item.room_index === roomIndex)

    if (items.length <= 0) {
      return
    }

    items.sort((a, b) => a.start_time_index - b.start_time_index)

    let lastTimeIndex = -1
    const shiftItems = items
      .map(item => {
        if (lastTimeIndex === -1) {
          lastTimeIndex = item.end_time_index
          return item
        }

        let newStartTimeIndex = lastTimeIndex + 1
        let newEndTimeIndex = newStartTimeIndex + item.duration_time_unit_count - 1

        if (newEndTimeIndex > maxEndTimeIndex) {
          newEndTimeIndex = maxEndTimeIndex
          newStartTimeIndex = newEndTimeIndex - item.duration_time_unit_count + 1
        }

        item.start_time_index = newStartTimeIndex
        item.end_time_index = newEndTimeIndex
        item.start_time_hh = calcStartTimeHH(newStartTimeIndex, scheduleStartTime)
        item.start_time_mm = calcStartTimeMM(newStartTimeIndex)
        item.end_time_hh = calcEndTimeHH(newEndTimeIndex, scheduleStartTime)
        item.end_time_mm = calcEndTimeMM(newEndTimeIndex)

        lastTimeIndex = newEndTimeIndex

        return item
      })
      .filter(item => item !== undefined)

    if (shiftItems && shiftItems.length > 0) {
      const reqShiftItems: ItemShiftValues = {
        room_index: roomIndex,
      }
      onItemShift(reqShiftItems)
      update(shiftItems)
    }
  }

  return (
    <div
      style={{
        ...(visible === false ? { display: 'none' } : {}),
        width: `${zoom}%`,
      }}
      className={`flex-1 min-h-[45px] flex bg-white text-xs text-black`}
    >
      <div
        ref={rowHeaderRef}
        className={`bg-white min-h-[45px] flex items-center sticky left-0 z-[100]`}
        style={{ width: `${COLUMN_HEADER_WIDTH}px` }}
      >
        <div className='w-[100px] ml-3 truncate select-none' title={roomName}>
          {roomName}
        </div>
        <div
          className={`w-[10%] bg-purple-500 hover:bg-purple-800 min-w-6 aspect-square flex items-center justify-center rounded-full p-[5.5px] ml-1 mr-2 ${!isDisableClick ? 'cursor-pointer' : ''}`}
          {...(!isDisableClick && { onClick: () => shiftExec(roomIndex) })}
        >
          <IconArrowBarToLeft className='w-full h-full text-white' />
        </div>
      </div>
      <RoomCell
        roomIndex={roomIndex}
        roomItemList={roomItemList}
        update={update}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        draggingInfo={draggingInfo}
        handleDrag={handleDrag}
        isDeviding={isDeviding}
        setIsDeviding={setIsDeviding}
        parentRef={parentRef}
        timeIndex={timeIndex}
        isDisableClick={isDisableClick}
        maxEndTimeIndex={maxEndTimeIndex}
        scheduleStartTime={scheduleStartTime}
        scheduleEndTime={scheduleEndTime}
        zoom={zoom}
        onItemMoveUpdate={onItemMoveUpdate}
        onItemReturnListUpdate={onItemReturnListUpdate}
        onItemDeivde={onItemDeivde}
        onItemJoin={onItemJoin}
      />
    </div>
  )
}
