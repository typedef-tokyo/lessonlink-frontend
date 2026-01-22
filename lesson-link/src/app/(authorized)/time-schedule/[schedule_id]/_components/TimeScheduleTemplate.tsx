'use client'

import { COLOR_MAP, LESSON_COLOR, OVERLAP_COLOR } from '@constants/Constants'
import { Overlay } from '@mantine/core'
import { Mutex } from 'async-mutex'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { calcEndTime2Index, calcStartTime2Index } from '@/app/lib/util'
import { schemas } from '@/generated/api'
import { DraggingInfo, ItemPayload, LessonItem, RoomItem } from '../../types'
import { LessonList } from './LessonListTemplate'
import { TimeScheduleDetail } from './TimeScheduleDetail/TimeScheduleDetailTemplate'

type ItemMoveRequest = Zod.infer<typeof schemas.controller_ScheduleItemMoveRequestData>
export type ItemMoveValues = Omit<ItemMoveRequest, 'history_index'> &
  Partial<Pick<ItemMoveRequest, 'history_index'>>

type ItemReturnListRequest = Zod.infer<typeof schemas.controller_ScheduleItemReturnListRequestData>
export type ItemReturnListValues = Omit<ItemReturnListRequest, 'history_index'> &
  Partial<Pick<ItemReturnListRequest, 'history_index'>>

type ItemDivideRequest = Zod.infer<typeof schemas.controller_ScheduleItemDivideRequestData>
export type ItemDivideValues = Omit<ItemDivideRequest, 'history_index'> &
  Partial<Pick<ItemDivideRequest, 'history_index'>>

type ItemJoinRequest = Zod.infer<typeof schemas.controller_ScheduleItemJoinRequestData>
export type ItemJoinValues = Omit<ItemJoinRequest, 'history_index'> &
  Partial<Pick<ItemJoinRequest, 'history_index'>>

type ItemShiftRequest = Zod.infer<typeof schemas.controller_ScheduleItemShiftRequestData>
export type ItemShiftValues = Omit<ItemShiftRequest, 'history_index'> &
  Partial<Pick<ItemShiftRequest, 'history_index'>>

export type schedule = Zod.infer<typeof schemas.presenter_ScheduleGetResponse>

type Props = {
  schedule: schedule
  roomItemList: Array<RoomItem>
  setRoomItemList: React.Dispatch<React.SetStateAction<Array<RoomItem>>>
  onItemMoveUpdate: (values: ItemMoveValues) => void
  onItemReturnListUpdate: (values: ItemReturnListValues) => void
  onItemDeivde: (values: ItemDivideValues) => void
  onItemJoin: (values: ItemJoinValues) => void
  onItemShift: (values: ItemShiftValues) => void
  isDisableClick: boolean
  invisibleRoomOpen: () => void
  scheduleStartTime: number
  scheduleEndTime: number
}

const mutex = new Mutex()

export const TimeScheduleTemplate = ({
  schedule,
  roomItemList,
  setRoomItemList,
  onItemMoveUpdate,
  onItemReturnListUpdate,
  onItemDeivde,
  onItemJoin,
  onItemShift,
  isDisableClick,
  invisibleRoomOpen,
  scheduleStartTime,
  scheduleEndTime,
}: Props) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isDeviding, setIsDeviding] = useState<false | string>(false)

  const handleOverlayClose = () => {
    setIsDeviding(false)
  }

  const handleIsDragging = ({ flag }: { flag: boolean }) => {
    setIsDragging(flag)
  }

  const [lessonList, setLessonList] = useState<Array<LessonItem>>([])

  useEffect(() => {
    setLessonList(
      schedule.lesson_item_list.map(item => ({
        type: 'list',
        tag: 'lesson',
        uniq_id: item.identifier,
        item_id: item.lesson_id,
        color: LESSON_COLOR,
        name: item.lesson_name,
        duration: item.duration,
        duration_time_unit_count: item.duration,
        offset_x_start: null,
        offset_x_end: null,
        offset_y_top: null,
        offset_y_bottom: null,
        delete: false,
      })),
    )

    setRoomItemList(
      schedule.room_lesson_list.map(item => ({
        type: 'room',
        tag: item.item_tag as 'lesson' | 'cleaning',
        uniq_id: item.identifier,
        item_id: item.lesson_id,
        color: LESSON_COLOR,
        name: item.lesson_name,
        duration: item.duration,
        duration_time_unit_count: item.duration,
        start_time_hh: item.start_time_hour,
        start_time_mm: item.start_time_minutes,
        end_time_hh: item.end_time_hour,
        end_time_mm: item.end_time_minutes,
        start_time_index: calcStartTime2Index(
          item.start_time_hour,
          item.start_time_minutes,
          schedule.schedule_start_time,
        ),
        end_time_index: calcEndTime2Index(
          item.end_time_hour,
          item.end_time_minutes,
          schedule.schedule_start_time,
        ),
        room_index: item.room_index,
        offset_x_start: null,
        offset_x_end: null,
        offset_y_top: null,
        offset_y_bottom: null,
        widthPercent: null,
        leftPercent: null,
        delete: false,
      })),
    )
  }, [schedule])

  const getOverlappingItems = (items: RoomItem[], target: RoomItem): RoomItem[] => {
    return items.filter(
      item =>
        item.uniq_id !== target.uniq_id &&
        item.room_index === target.room_index &&
        item.start_time_index !== null &&
        item.end_time_index !== null &&
        target.start_time_index !== null &&
        target.end_time_index !== null &&
        item.start_time_index <= target.end_time_index &&
        item.end_time_index >= target.start_time_index,
    )
  }

  const updateOverlappingColors = () => {
    setRoomItemList(prev => {
      let hasChanges = false

      const updatedList = prev.map(item => {
        const overlapItems = getOverlappingItems(prev, item)

        if (overlapItems.length > 0) {
          if (item.color !== OVERLAP_COLOR) {
            hasChanges = true
            return { ...item, color: OVERLAP_COLOR }
          }
        } else {
          let originalColor = COLOR_MAP[item.tag]
          if (item.color !== originalColor) {
            hasChanges = true
            return { ...item, color: originalColor }
          }
        }
        return item
      })

      return hasChanges ? updatedList : prev
    })
  }

  useEffect(() => {
    updateOverlappingColors()
  }, [roomItemList])

  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo | null>(null)

  const listMap: Record<'list' | 'room', React.Dispatch<React.SetStateAction<any[]>>> = {
    list: setLessonList,
    room: setRoomItemList,
  }

  const handleUpdate = async (payloads: ItemPayload | ItemPayload[]) => {
    const updates = Array.isArray(payloads) ? payloads : [payloads]

    await mutex.runExclusive(async () => {
      const itemsToUpdateByType: { [type: string]: ItemPayload[] } = {}
      const idsToDelete = new Set<string>()

      const idToTargetType = new Map<string, string>()

      for (const payload of updates) {
        if (payload.delete) {
          idsToDelete.add(payload.uniq_id)
          continue
        }

        let updatedPayload = { ...payload }

        if (updatedPayload.tag === 'cleaning' && updatedPayload.uniq_id === '') {
          updatedPayload.uniq_id = uuidv4()
        }

        if (!itemsToUpdateByType[updatedPayload.type]) {
          itemsToUpdateByType[updatedPayload.type] = []
        }
        itemsToUpdateByType[updatedPayload.type].push(updatedPayload)

        idToTargetType.set(updatedPayload.uniq_id, updatedPayload.type)
      }

      Object.entries(listMap).forEach(([key, setList]) => {
        const updateItems = itemsToUpdateByType[key] ?? []

        setList(prev => {
          let result = [...prev]

          result = result.filter(item => {
            const shouldDelete = idsToDelete.has(item.uniq_id)
            const movedToAnotherType =
              idToTargetType.has(item.uniq_id) && idToTargetType.get(item.uniq_id) !== key

            return !shouldDelete && !movedToAnotherType
          })

          updateItems.forEach(payload => {
            const index = result.findIndex(item => item.uniq_id === payload.uniq_id)
            if (index !== -1) {
              result[index] = payload
            } else {
              result.push(payload)
            }
          })

          return result
        })
      })
    })
  }

  const handleDrag = (payload: DraggingInfo) => {
    setDraggingInfo(payload)
  }

  const [timeIndex, setTimeIndex] = useState<{ startIndex: number; endIndex: number }>({
    startIndex: -1,
    endIndex: -1,
  })

  const setBandleTimeIndex = (startIndex: number, endIndex: number) => {
    setTimeIndex({
      startIndex: startIndex,
      endIndex: endIndex,
    })
  }

  useEffect(() => {
    if (!isDragging) {
      setBandleTimeIndex(-1, -1)
    }
  }, [isDragging])

  return (
    <div className='h-full w-full bg-[#EDEDED] flex flex-col overflow-y-auto relative'>
      {isDeviding && (
        <>
          <Overlay color='black' opacity={0.6} zIndex={999} onClick={handleOverlayClose} />
        </>
      )}
      <div className='h-full overflow-y-auto custom-scrollbar'>
        <LessonList
          lessonList={lessonList}
          update={handleUpdate}
          isDragging={isDragging}
          setIsDragging={handleIsDragging}
          handleDrag={handleDrag}
          draggingInfo={draggingInfo}
          isDeviding={isDeviding}
          setIsDeviding={setIsDeviding}
          timeIndex={timeIndex}
          isDisableClick={isDisableClick}
          scheduleStartTimeHH={scheduleStartTime}
          onItemDeivde={onItemDeivde}
          onItemJoin={onItemJoin}
        />
        <TimeScheduleDetail
          roomItemList={roomItemList}
          rooms={schedule.rooms}
          update={handleUpdate}
          isDragging={isDragging}
          setIsDragging={handleIsDragging}
          draggingInfo={draggingInfo}
          handleDrag={handleDrag}
          isDeviding={isDeviding}
          setIsDeviding={setIsDeviding}
          timeIndex={timeIndex}
          setBandleTimeIndex={setBandleTimeIndex}
          isDisableClick={isDisableClick}
          scheduleStartTime={scheduleStartTime}
          scheduleEndTime={scheduleEndTime}
          invisibleRoomOpen={invisibleRoomOpen}
          onItemMoveUpdate={onItemMoveUpdate}
          onItemReturnListUpdate={onItemReturnListUpdate}
          onItemDeivde={onItemDeivde}
          onItemJoin={onItemJoin}
          onItemShift={onItemShift}
        />
      </div>
    </div>
  )
}
