'use client'

import React, { useEffect, useRef, useState } from 'react'
import { calcEndTimeHH, calcEndTimeMM, calcStartTimeHH, calcStartTimeMM } from '@/app/lib/util'
import { CleaningItem, DraggingInfo, ItemPayload, RoomItem } from '../../types'
import { ItemMoveValues } from './TimeScheduleTemplate'

type Props = {
  item: ItemPayload
  setIsDragging: (args: { flag: boolean }) => void
  update: (payload: ItemPayload) => void
  widthPercent: number
  handleDrag: (payload: DraggingInfo) => void
  timeLineParentWidth: number
  updateRoomCellWidth: ((key: string, widthPer: number) => void) | null
  timeIndex: { startIndex: number; endIndex: number }
  isDisableClick: boolean
  scheduleStartTimeHH: number
  maxEndTimeIndex: number | null
  onItemMoveUpdate: (values: ItemMoveValues) => void
}

const ACTIVITY_MINUTES_TIME_UNIT = 5

export const DefaultCleaningItem: CleaningItem = {
  type: '',
  tag: 'cleaning',
  uniq_id: '',
  item_id: 0,
  color: 'bg-[#10AA46]',
  name: '清掃',
  duration: 20,
  duration_time_unit_count: 20,
  offset_x_start: null,
  offset_x_end: null,
  offset_y_top: null,
  offset_y_bottom: null,
  delete: false,
}

export const ActivityTimebar = ({
  item,
  setIsDragging,
  update,
  widthPercent,
  handleDrag,
  timeLineParentWidth,
  updateRoomCellWidth,
  timeIndex,
  isDisableClick,
  scheduleStartTimeHH,
  maxEndTimeIndex,
  onItemMoveUpdate,
}: Props) => {
  const myRootRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const [isDraggingLocal, setIsDraggingLocal] = useState(false)

  ///////////////////////
  // Drag
  ///////////////////////
  useEffect(() => {
    setIsDragging({ flag: isDraggingLocal })
  }, [isDraggingLocal])

  const [dragStartPosition, setDragStartPosition] = useState({
    offsetX: 0,
    offsetY: 0,
    start: 0,
    end: 0,
    top: 0,
    bottom: 0,
  })

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingLocal && myRootRef.current) {
      if (item.type === 'room') {
        if (timeLineParentWidth !== null && item.widthPercent !== null) {
          const rootWidth = document.documentElement.clientWidth
          const diffPer = timeLineParentWidth / rootWidth
          myRootRef.current.style.width = `${item.widthPercent * diffPer}%`
        }
      } else {
        myRootRef.current.style.width = `${myRootRef.current.offsetWidth}px`
      }

      const draggable = myRootRef.current

      const startX = e.clientX - dragStartPosition.offsetX
      const startY = e.clientY - dragStartPosition.offsetY

      draggable.style.position = 'fixed'
      draggable.style.left = `${startX}px`
      draggable.style.top = `${startY}px`
      draggable.style.pointerEvents = 'none'

      handleDrag({
        ...item,
        delete: false,
        dragging_x: startX,
        dragging_y: startY,
        offset_x: dragStartPosition.offsetX,
        offset_y: dragStartPosition.offsetY,
      })

      setPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    const draggable = myRootRef.current
    const LEFT_CLICK = 0

    if (draggable && e.button === LEFT_CLICK) {
      draggable.style.pointerEvents = 'auto'

      if (item.type === 'room') {
        draggable.style.width = `100%`
        draggable.style.transition = 'all 0.3s ease'
      } else {
        draggable.style.transition = 'all 0.1s ease'
      }

      draggable.style.left = `${draggable.style.left}px`
      draggable.style.width = `${dragStartPosition.end - dragStartPosition.start}px`
      draggable.style.top = `${draggable.style.top}px`

      draggable.addEventListener(
        'transitionend',
        () => {
          draggable.style.transition = ''
          draggable.style.position = ''
          draggable.style.left = ''
          draggable.style.top = ''
          draggable.style.width = '100%'
        },
        { once: true },
      )

      setPosition({ x: e.clientX, y: e.clientY })

      setIsDraggingLocal(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!isDraggingLocal) {
      if (myRootRef.current) {
        const rect = myRootRef.current.getBoundingClientRect()

        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top
        setDragStartPosition({
          offsetX: offsetX,
          offsetY: offsetY,
          start: rect.left,
          end: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        })

        update({
          ...item,
          offset_x_start: offsetX,
          offset_x_end: rect.right - e.clientX,
          offset_y_top: offsetY,
          offset_y_bottom: rect.bottom - e.clientY,
        })
      }

      setIsDraggingLocal(true)
    }
  }

  useEffect(() => {
    if (isDraggingLocal) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingLocal])

  const [itemDetailTxt, setItemDetailTxt] = useState('')
  useEffect(() => {
    setItemDetailTxt(`${item.name} ${item.duration}分`)
  }, [item])

  //////////////////
  // Resize
  //////////////////
  const [isResizing, setIsResizing] = useState(false)
  const isMoved = useRef<boolean>(false)
  const initialWidth = useRef<number>(-1)
  const blockWidthUnit = useRef<number>(-1)
  const barBlockLengthRef = useRef<number>(item.duration_time_unit_count)

  useEffect(() => {
    if (isResizing) {
      isMoved.current = false

      const handleMouseMove = (e: MouseEvent) => handleResizeMove(e)
      const handleMouseUp = () => handleResizeEnd()
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  const handleResizeStart = () => {
    if (!myRootRef.current) return

    const myRect = myRootRef.current.getBoundingClientRect()
    if (initialWidth.current == -1) {
      initialWidth.current = myRect.width
    }
    setIsResizing(true)

    if (blockWidthUnit.current == -1) {
      blockWidthUnit.current =
        (myRect.width / item.duration_time_unit_count) * ACTIVITY_MINUTES_TIME_UNIT
    }
  }

  const handleResizeEnd = () => {
    if ((item as RoomItem).type !== 'room') return
    if (!isMoved.current) {
      blockWidthUnit.current = -1
      setIsResizing(false)
      return
    }

    const length =
      (item as RoomItem).start_time_index + barBlockLengthRef.current * ACTIVITY_MINUTES_TIME_UNIT
    const updateRoomItem = {
      ...(item as RoomItem),
      duration: barBlockLengthRef.current * ACTIVITY_MINUTES_TIME_UNIT,
      duration_time_unit_count: barBlockLengthRef.current * ACTIVITY_MINUTES_TIME_UNIT,
      end_time_hh: calcEndTimeHH(length - 1, scheduleStartTimeHH),
      end_time_mm: calcEndTimeMM(length - 1),
      end_time_index: length - 1,
    }

    onItemMoveUpdate({
      lesson_id: updateRoomItem.item_id,
      item_tag: updateRoomItem.tag,
      identifier: updateRoomItem.uniq_id,
      duration: updateRoomItem.duration,
      end_time_hour: updateRoomItem.end_time_hh,
      end_time_minutes: updateRoomItem.end_time_mm,
      start_time_hour: updateRoomItem.start_time_hh,
      start_time_minute: updateRoomItem.start_time_mm,
      room_index: updateRoomItem.room_index,
    })

    update(updateRoomItem)

    setIsResizing(false)
    blockWidthUnit.current = -1
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (
      !isResizing ||
      !myRootRef.current ||
      initialWidth.current == -1 ||
      blockWidthUnit.current == -1 ||
      maxEndTimeIndex === null
    )
      return

    isMoved.current = true

    const myRect = myRootRef.current.getBoundingClientRect()
    const blockUnitWidth = blockWidthUnit.current

    const moveX = e.clientX

    const start = myRect.left
    const diff = moveX - start

    let barBlockLength = Math.ceil(diff / blockUnitWidth)

    if (barBlockLength <= 1) {
      barBlockLength = 1
    }

    const startIndex = (item as RoomItem).start_time_index
    const endIndex = startIndex + barBlockLength * ACTIVITY_MINUTES_TIME_UNIT
    if (endIndex > maxEndTimeIndex + 1) {
      return
    }

    setItemDetailTxt(`${item.name} ${barBlockLength * ACTIVITY_MINUTES_TIME_UNIT}分`)

    barBlockLengthRef.current = barBlockLength

    if (updateRoomCellWidth) {
      const fixWidthPer =
        ((barBlockLength * blockUnitWidth) / initialWidth.current) *
        (initialWidth.current / timeLineParentWidth) *
        100
      updateRoomCellWidth(item.uniq_id, fixWidthPer)
    }
  }

  const [timeToolTip, setTimeToolTip] = useState('')
  useEffect(() => {
    if (
      isResizing ||
      (item.type !== 'room' && (timeIndex.startIndex === -1 || timeIndex.endIndex === -1))
    ) {
      setTimeToolTip('')
      return
    }
    let startTimeHH = calcStartTimeHH(timeIndex.startIndex, scheduleStartTimeHH)
    let startTimeMM = calcStartTimeMM(timeIndex.startIndex)
    let endTimeHH = calcEndTimeHH(timeIndex.endIndex, scheduleStartTimeHH)
    let endTimeMM = calcEndTimeMM(timeIndex.endIndex)

    if ((timeIndex.startIndex === -1 || timeIndex.endIndex === -1) && item.type === 'room') {
      startTimeHH = calcStartTimeHH(item.start_time_index, scheduleStartTimeHH)
      startTimeMM = calcStartTimeMM(item.start_time_index)
      endTimeHH = calcEndTimeHH(item.end_time_index, scheduleStartTimeHH)
      endTimeMM = calcEndTimeMM(item.end_time_index)
    }

    const formattedTimeStart = `${startTimeHH}:${startTimeMM.toString().padStart(2, '0')}`
    const formattedTimeEnd = `${endTimeHH}:${endTimeMM.toString().padStart(2, '0')}`
    setTimeToolTip(`${formattedTimeStart}~${formattedTimeEnd}`)
  }, [timeIndex, isResizing, item])

  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showDIff, setShowDIff] = useState(0)

  useEffect(() => {
    const APPLY_TARGET_RATIO = 4
    const SCREEN_DIVISOR = 5
    if (position.x < (window.innerWidth * APPLY_TARGET_RATIO) / SCREEN_DIVISOR) {
      setShowDIff(0)
    } else {
      if (!tooltipRef.current) return
      setShowDIff(tooltipRef.current.offsetWidth)
    }
  }, [position])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      ref={myRootRef}
      className={`group flex h-[25px] ${item.color} justify-between rounded border border-white pl-1 relative select-none ${
        isDraggingLocal ? 'z-[200]' : isDraggingLocal ? 'z-[100]' : isHovered ? 'z-[63]' : 'z-[62]'
      } transition-opacity duration-500 ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={{
        width: `${widthPercent}%`,
      }}
      onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={false}
    >
      <div
        className={`h-full w-full text-white text-xs items-center mt-1 overflow-hidden text-ellipsis whitespace-nowrap select-none ${!isDisableClick ? 'cursor-pointer' : ''}`}
        {...(!isDisableClick ? { onMouseDown: e => e.button === 0 && handleClick(e) } : {})}
      >
        {itemDetailTxt}
      </div>
      {item.type === 'room' && (
        <div
          className={`top-0 right-0 h-full w-1 bg-transparent ${!isDisableClick ? 'cursor-ew-resize' : ''}`}
          {...(!isDisableClick && { onMouseDown: handleResizeStart })}
        ></div>
      )}
      {!isResizing && (
        <div
          ref={tooltipRef}
          className={`${
            isDraggingLocal
              ? 'absolute top-0 left-0 translate-y-[-120%]'
              : 'fixed translate-y-[-101%]'
          } bg-orange-600 text-white text-xs p-1 rounded whitespace-nowrap z-[2147483647] pointer-events-none transition-opacity duration-350 ease-in-out ${
            isDraggingLocal ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={
            isDraggingLocal
              ? { left: showDIff * -1 }
              : { left: position.x - showDIff + 5, top: position.y - 5 }
          }
        >
          {timeToolTip && (
            <>
              {timeToolTip}
              <br />
            </>
          )}
          {itemDetailTxt}
        </div>
      )}
    </div>
  )
}
