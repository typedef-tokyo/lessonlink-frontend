'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { calcEndTimeHH, calcEndTimeMM, calcStartTimeHH, calcStartTimeMM } from '@/app/lib/util'
import { DraggingInfo, ItemPayload, LessonItem, RoomItem } from '../../../types'
import { ActivityTimebar } from '../ActivityTimebar'
import { MaterialTimebar } from '../MaterialTimebar'
import {
  ItemDivideValues,
  ItemJoinValues,
  ItemMoveValues,
  ItemReturnListValues,
} from '../TimeScheduleTemplate'
import { HourBlock } from './HourBlock'

type Props = {
  roomIndex: number
  roomItemList: Array<RoomItem>
  update: (payload: ItemPayload | ItemPayload[]) => void
  isDragging: boolean
  setIsDragging: (args: { flag: boolean }) => void
  draggingInfo: DraggingInfo | null
  handleDrag: (payload: DraggingInfo) => void
  isDeviding: boolean | string
  setIsDeviding: (state: false | string) => void
  parentRef: React.RefObject<HTMLDivElement>
  timeIndex: { startIndex: number; endIndex: number }
  isDisableClick: boolean
  maxEndTimeIndex: number
  scheduleStartTime: number
  scheduleEndTime: number
  zoom: number
  onItemMoveUpdate: (values: ItemMoveValues) => void
  onItemReturnListUpdate: (values: ItemReturnListValues) => void
  onItemDeivde: (values: ItemDivideValues) => void
  onItemJoin: (values: ItemJoinValues) => void
}

export const RoomCell = ({
  roomIndex,
  roomItemList,
  update,
  isDragging,
  setIsDragging,
  draggingInfo,
  handleDrag,
  isDeviding,
  setIsDeviding,
  parentRef,
  timeIndex,
  isDisableClick,
  maxEndTimeIndex,
  scheduleStartTime,
  scheduleEndTime,
  zoom,
  onItemMoveUpdate,
  onItemReturnListUpdate,
  onItemDeivde,
  onItemJoin,
}: Props) => {
  const INITIAL_VALUE = -1
  const parentDivRef = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const dropRoom = useRef(INITIAL_VALUE)
  const dropPositions = useRef({
    startX: INITIAL_VALUE,
    endX: INITIAL_VALUE,
    startIndex: INITIAL_VALUE,
    endXIndex: INITIAL_VALUE,
  })
  const [parentWidth, setParentWidth] = useState(0)
  const overlapRef = useRef<boolean>(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingInfo) {
        const draggingItem = draggingInfo

        const barStart = e.clientX - draggingInfo.offset_x
        const barTop = e.clientY - draggingInfo.offset_y

        const overlapBgColor = 'rgba(173, 216, 230, 0.5)'
        let unitCount = 0
        dropRoom.current = INITIAL_VALUE
        dropPositions.current.startX = INITIAL_VALUE
        dropPositions.current.endX = INITIAL_VALUE
        refs.current.forEach((ref, index) => {
          if (ref) {
            const rect = ref.getBoundingClientRect()

            ref.style.backgroundColor = ''

            if (unitCount > 0 && unitCount < draggingItem.duration_time_unit_count) {
              ref.style.backgroundColor = overlapBgColor
              unitCount++
              dropPositions.current.endX = rect.right
              dropPositions.current.endXIndex = index
              return
            }

            if (unitCount >= draggingItem.duration_time_unit_count) {
              ref.style.backgroundColor = ''
              return
            }

            if (
              rect.left <= barStart &&
              barStart <= rect.right &&
              rect.top <= barTop &&
              barTop <= rect.bottom
            ) {
              unitCount++
              dropRoom.current = roomIndex
              dropPositions.current.startX = rect.left
              dropPositions.current.endX = rect.right
              dropPositions.current.startIndex = index
              dropPositions.current.endXIndex = index
              ref.style.backgroundColor = overlapBgColor
            }
          }
        })
      }
    },
    [draggingInfo],
  )

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
      }
    } else {
      const draggingItem = draggingInfo
      if (!draggingItem || !parentRef.current) {
        return
      }

      const parentRect = parentRef.current.getBoundingClientRect()

      if (draggingItem.dragging_y < parentRect.top || draggingItem.dragging_y > parentRect.bottom) {
        const deleteItem: RoomItem = {
          ...(draggingItem as RoomItem),
          delete: true,
        }

        if (deleteItem.room_index !== roomIndex) {
          return
        }

        onItemReturnListUpdate({
          lesson_id: deleteItem.item_id,
          identifier: deleteItem.uniq_id,
          duration: deleteItem.duration,
        })

        let payloads: ItemPayload[] = [deleteItem]

        if (draggingItem.tag === 'lesson') {
          const returnItem: ItemPayload = {
            ...draggingItem,
            type: 'list',
          } as LessonItem

          payloads.push(returnItem)
        }

        update(payloads)
        return
      }

      if (dropRoom.current !== roomIndex) {
        return
      }

      refs.current.forEach((ref, _) => {
        if (ref) {
          ref.style.backgroundColor = ''
        }
      })

      if (
        dropPositions.current.endXIndex - dropPositions.current.startIndex !==
        draggingItem.duration_time_unit_count - 1
      ) {
        return
      }

      if (!parentDivRef.current) {
        return
      }

      if (overlapRef.current) {
        return
      }

      const roomAddItem: RoomItem = {
        ...(draggingItem as RoomItem),
        type: 'room',
        uniq_id:
          draggingItem.tag === 'cleaning' && draggingItem.uniq_id === ''
            ? uuidv4()
            : draggingItem.uniq_id,
        tag: draggingItem.tag,
        start_time_hh: calcStartTimeHH(dropPositions.current.startIndex, scheduleStartTime),
        start_time_mm: calcStartTimeMM(dropPositions.current.startIndex),
        end_time_hh: calcEndTimeHH(dropPositions.current.endXIndex, scheduleStartTime),
        end_time_mm: calcEndTimeMM(dropPositions.current.endXIndex),
        room_index: roomIndex,
        start_time_index: dropPositions.current.startIndex,
        end_time_index: dropPositions.current.endXIndex,
      }

      onItemMoveUpdate({
        lesson_id: roomAddItem.item_id,
        item_tag: roomAddItem.tag,
        identifier: roomAddItem.uniq_id,
        duration: roomAddItem.duration,
        room_index: roomAddItem.room_index,
        start_time_hour: roomAddItem.start_time_hh,
        start_time_minute: roomAddItem.start_time_mm,
        end_time_hour: roomAddItem.end_time_hh,
        end_time_minutes: roomAddItem.end_time_mm,
      })

      update(roomAddItem)
    }
  }, [isDragging, handleMouseMove, refs])

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
  }, [roomItemList, parentDivRef, zoom])

  const updateRoomCellWidth = (key: string, value: number) => {
    setRoomCellWidthPer(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (!parentDivRef.current) return

    const observer = new ResizeObserver(() => {
      setParentWidth(parentDivRef.current!.offsetWidth)
    })

    observer.observe(parentDivRef.current)

    return () => observer.disconnect()
  }, [])

  const operatingHours = scheduleEndTime - scheduleStartTime

  return (
    <div ref={parentDivRef} className='flex-1 flex relative'>
      {Array.from({ length: operatingHours }, (_, outerIndex) => (
        <HourBlock key={outerIndex} outerIndex={outerIndex} refs={refs} />
      ))}

      {roomItemList
        .filter(roomItem => roomItem.room_index === roomIndex)
        .map((roomItem, _) => {
          if (
            !parentDivRef ||
            !parentDivRef.current ||
            roomItem.start_time_index === null ||
            roomItem.end_time_index === null
          ) {
            return
          }

          const startRef = refs.current[roomItem.start_time_index]
          const endRef = refs.current[roomItem.end_time_index]

          if (!startRef || !endRef) return

          return (
            <div
              key={roomItem.uniq_id}
              className='h-full absolute flex items-center'
              style={{
                left: `${leftPercent[roomItem.uniq_id]}%`,
                width: `${roomCellWidthPer[roomItem.uniq_id]}%`,
              }}
            >
              {roomItem.tag === 'lesson' ? (
                <MaterialTimebar
                  item={roomItem}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  update={update}
                  widthPercent={100}
                  handleDrag={handleDrag}
                  draggingInfo={draggingInfo}
                  isDeviding={isDeviding}
                  setIsDeviding={setIsDeviding}
                  timeLineParentWidth={parentWidth}
                  timeIndex={timeIndex}
                  isDisableClick={isDisableClick}
                  scheduleStartTimeHH={scheduleStartTime}
                  maxEndTimeIndex={maxEndTimeIndex}
                  onItemDeivde={onItemDeivde}
                  onItemJoin={onItemJoin}
                  overlapRef={overlapRef}
                />
              ) : (
                <ActivityTimebar
                  item={roomItem}
                  setIsDragging={setIsDragging}
                  update={update}
                  widthPercent={100}
                  handleDrag={handleDrag}
                  timeLineParentWidth={parentWidth}
                  updateRoomCellWidth={updateRoomCellWidth}
                  timeIndex={timeIndex}
                  isDisableClick={isDisableClick}
                  scheduleStartTimeHH={scheduleStartTime}
                  maxEndTimeIndex={maxEndTimeIndex}
                  onItemMoveUpdate={onItemMoveUpdate}
                />
              )}
            </div>
          )
        })}
    </div>
  )
}
