'use client'

import { UNIT_TIME_MINUTES } from '@constants/Constants'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { calcEndTimeHH, calcEndTimeMM, calcStartTimeHH, calcStartTimeMM } from '@/app/lib/util'
import { DraggingInfo, ItemPayload, RoomItem } from '../../types'
import { ItemDivideValues, ItemJoinValues } from './TimeScheduleTemplate'

type Props = {
  item: ItemPayload
  isDragging: boolean
  setIsDragging: (args: { flag: boolean }) => void
  update: (payload: ItemPayload | ItemPayload[]) => void
  widthPercent: number
  handleDrag: (payload: DraggingInfo) => void
  draggingInfo: DraggingInfo | null
  isDeviding: boolean | string
  setIsDeviding: (state: false | string) => void
  timeLineParentWidth: number | null
  timeIndex: { startIndex: number; endIndex: number }
  isDisableClick: boolean
  scheduleStartTimeHH: number
  maxEndTimeIndex: number | null
  onItemDeivde: (values: ItemDivideValues) => void
  onItemJoin: (values: ItemJoinValues) => void
  overlapRef?: MutableRefObject<boolean>
}

export const MaterialTimebar = ({
  item,
  isDragging,
  setIsDragging,
  update,
  widthPercent,
  handleDrag,
  draggingInfo,
  isDeviding,
  setIsDeviding,
  timeLineParentWidth,
  timeIndex,
  isDisableClick,
  scheduleStartTimeHH,
  maxEndTimeIndex,
  onItemDeivde,
  onItemJoin,
  overlapRef,
}: Props) => {
  const myRootRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const [isDraggingLocal, setIsDraggingLocal] = useState(false)
  const itemRef = useRef(item)

  useEffect(() => {
    itemRef.current = item
  }, [item])

  ///////////////////////----------------------------------------------
  // Drag
  ///////////////////////----------------------------------------------
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

  const [isDevidingSelf, setIsDevidingSelf] = useState(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingLocal && myRootRef.current) {
      if (item.type === 'room') {
        if (
          (myRootRef.current.style.width === '100%' || myRootRef.current.style.width === '') &&
          timeLineParentWidth !== null &&
          item.widthPercent !== null
        ) {
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
        ...itemRef.current,
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

      draggable.style.transition = 'all 0.5s ease'
      draggable.style.left = `${draggable.style.left}px`
      draggable.style.width = `${dragStartPosition.end - dragStartPosition.start}px`
      draggable.style.top = `${draggable.style.top}px`

      draggable.addEventListener(
        'transitionend',
        () => {
          if (item.type === 'room') {
            draggable.style.width = `100%`
          }

          draggable.style.transition = ''
          draggable.style.position = ''
          draggable.style.left = ''
          draggable.style.top = ''
        },
        { once: true },
      )

      setPosition({ x: e.clientX, y: e.clientY })

      setIsDraggingLocal(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!isDraggingLocal) {
      if (overlapRef) {
        overlapRef.current = false
      }

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

  ///////////////////////
  // Divde
  ///////////////////////
  const devideLineRef = useRef<HTMLDivElement | null>(null)

  const [devideStartPosition, setDevideStartPosition] = useState({
    rootWidthSize: 0,
    offsetX: 0,
  })

  const divideIndexRef = useRef(-1)

  const handleMouseDeviding = (e: MouseEvent) => {
    if (!isDeviding || !devideLineRef.current) return

    const line = devideLineRef.current
    const nowPostionX = e.clientX - devideStartPosition.offsetX

    const blockUnitWidth = devideStartPosition.rootWidthSize / item.duration_time_unit_count

    let divdeX = 0
    let devideIndex = -1
    for (let i = item.duration_time_unit_count - 0; i >= 0; i--) {
      const block = blockUnitWidth * i
      if (block < nowPostionX) {
        divdeX = block
        devideIndex = i
        break
      }
    }

    if (divdeX <= blockUnitWidth) {
      divdeX = blockUnitWidth
      devideIndex = 1
    }

    if (divdeX >= blockUnitWidth * (item.duration_time_unit_count - 1)) {
      divdeX = blockUnitWidth * (item.duration_time_unit_count - 1)
      devideIndex = item.duration_time_unit_count - 1
    }

    divideIndexRef.current = devideIndex

    // パーセントに変換
    const xPer = divdeX / devideStartPosition.rootWidthSize

    line.style.position = 'absolute'
    line.style.left = `${xPer * 100}%`
  }

  const handleDeviding = (e: React.MouseEvent) => {
    if (!isDeviding) {
      if (!myRootRef.current) return

      setIsDeviding(item.uniq_id)

      const rect = myRootRef.current.getBoundingClientRect()

      setDevideStartPosition({
        rootWidthSize: rect.width,
        offsetX: rect.left,
      })
    } else {
      setIsDeviding(false)
    }
  }

  const onClickDevide = () => {
    if (!myRootRef || !myRootRef.current) return
    if ('tag' in item && item.tag === 'cleaning') return

    const devideIndex = divideIndexRef.current

    if (devideIndex == -1) {
      setIsDeviding(false)
      return
    }

    if (item.type === 'room') {
      if (
        item.end_time_mm === null ||
        item.start_time_index === null ||
        item.end_time_hh === null ||
        item.widthPercent === null
      )
        return
      const existWidthPer = devideIndex / item.duration_time_unit_count

      const newTime = item.duration_time_unit_count - devideIndex
      const newWidthPer =
        (item.duration_time_unit_count - devideIndex) / item.duration_time_unit_count

      const updatedItems = []

      const endTimeIndex = item.start_time_index + devideIndex - 1
      updatedItems.push({
        ...item,
        end_time_hh: calcEndTimeHH(endTimeIndex, scheduleStartTimeHH),
        end_time_mm: calcEndTimeMM(endTimeIndex),
        end_time_index: endTimeIndex,
        widthPercent: item.widthPercent * existWidthPer,
        process_time: devideIndex * UNIT_TIME_MINUTES,
        process_time_unit_count: devideIndex,
      })

      const startTimeIndex = item.start_time_index + devideIndex
      updatedItems.push({
        ...item,
        uniq_id: uuidv4(),
        start_time_hh: calcStartTimeHH(startTimeIndex, scheduleStartTimeHH),
        start_time_mm: calcStartTimeMM(startTimeIndex),
        start_time_index: startTimeIndex,
        widthPercent: item.widthPercent * newWidthPer,
        process_time: newTime * UNIT_TIME_MINUTES,
        process_time_unit_count: newTime,
      })

      onItemDeivde({
        lesson_id: item.item_id,
        identifier: item.uniq_id,
        divide_minutes: devideIndex,
      })

      update(updatedItems)
    } else {
      const newTime = item.duration_time_unit_count - devideIndex
      const updatedItems = [
        {
          ...item,
          process_time: devideIndex * UNIT_TIME_MINUTES,
          process_time_unit_count: devideIndex,
        },
        {
          ...item,
          uniq_id: uuidv4(),
          process_time: newTime * UNIT_TIME_MINUTES,
          process_time_unit_count: newTime,
        },
      ]

      onItemDeivde({
        lesson_id: item.item_id,
        identifier: item.uniq_id,
        divide_minutes: devideIndex,
      })

      update(updatedItems)
    }

    setIsDeviding(false)
  }

  useEffect(() => {
    if (isDeviding === item.uniq_id) {
      setIsDevidingSelf(true)
    } else {
      setIsDevidingSelf(false)
    }
  }, [isDeviding])

  useEffect(() => {
    if (isDeviding) {
      document.addEventListener('mousemove', handleMouseDeviding)
      document.addEventListener('mouseup', onClickDevide)
      return () => {
        document.removeEventListener('mousemove', handleMouseDeviding)
        document.removeEventListener('mouseup', onClickDevide)
      }
    }
  }, [isDevidingSelf])

  ///////////////////////
  // Join
  ///////////////////////
  const [isOverlap, setIsOverlap] = useState(false)

  const celarBgColor = () => {
    if (!myRootRef.current) return
    myRootRef.current.style.opacity = ''
  }

  useEffect(() => {
    if (
      !draggingInfo ||
      !myRootRef.current ||
      draggingInfo.tag === 'cleaning' ||
      item.tag === 'cleaning' ||
      !draggingInfo.offset_x_start ||
      !draggingInfo.offset_y_bottom ||
      !draggingInfo.offset_y_top
    )
      return

    celarBgColor()

    if (item.tag === draggingInfo.tag && item.uniq_id === draggingInfo.uniq_id) {
      return
    }

    if (draggingInfo.delete) {
      setIsOverlap(false)
      return
    }

    if (draggingInfo.type !== item.type) {
      setIsOverlap(false)
      return
    }

    if (item.tag !== draggingInfo.tag) {
      setIsOverlap(false)
      return
    }

    if (item.item_id !== draggingInfo.item_id) {
      setIsOverlap(false)
      return
    }

    const dragItemLeft = draggingInfo.dragging_x
    const dragItemTop = draggingInfo.dragging_y
    const dragItemBottom =
      draggingInfo.dragging_y + draggingInfo.offset_y_bottom + draggingInfo.offset_y_top
    const myRect = myRootRef.current.getBoundingClientRect()
    if (
      myRect.left <= dragItemLeft &&
      dragItemLeft <= myRect.right &&
      ((myRect.top <= dragItemTop && myRect.bottom >= dragItemTop) ||
        (myRect.top <= dragItemBottom && myRect.bottom >= dragItemBottom))
    ) {
      myRootRef.current.style.opacity = '0.8'
      if (overlapRef) {
        overlapRef.current = true
      }
      setIsOverlap(true)
    } else {
      if (overlapRef) {
        overlapRef.current = false
      }
      setIsOverlap(false)
    }
  }, [draggingInfo])

  useEffect(() => {
    if (!isDragging && draggingInfo && isOverlap) {
      if (item.tag === 'cleaning' || draggingInfo.tag === 'cleaning') return

      let joinPayload
      if (item.type === 'room') {
        if (
          item.start_time_hh === null ||
          item.start_time_mm === null ||
          item.start_time_index === null ||
          item.end_time_hh === null ||
          item.end_time_mm === null ||
          item.end_time_index === null ||
          item.widthPercent === null ||
          maxEndTimeIndex === null
        ) {
          return
        }

        let startTimeIndex = item.start_time_index
        let endTimeIndex = item.end_time_index + draggingInfo.duration_time_unit_count
        if (endTimeIndex > maxEndTimeIndex + 1) {
          endTimeIndex = maxEndTimeIndex
          startTimeIndex =
            endTimeIndex -
            (item.duration_time_unit_count + draggingInfo.duration_time_unit_count) +
            1
        }

        const growWidthWeight =
          draggingInfo.duration_time_unit_count +
          item.duration_time_unit_count / item.duration_time_unit_count

        joinPayload = {
          ...item,
          start_time_hh: calcStartTimeHH(startTimeIndex, scheduleStartTimeHH),
          start_time_mm: calcStartTimeMM(startTimeIndex),
          start_time_index: startTimeIndex,
          end_time_hh: calcEndTimeHH(endTimeIndex, scheduleStartTimeHH),
          end_time_mm: calcEndTimeMM(endTimeIndex),
          end_time_index: endTimeIndex,
          widthPercent: item.widthPercent * growWidthWeight,
          duration: item.duration + draggingInfo.duration,
          duration_time_unit_count:
            item.duration_time_unit_count + draggingInfo.duration_time_unit_count,
        }

        const room = joinPayload as RoomItem
        onItemJoin({
          join_from_identifier: draggingInfo.uniq_id,
          join_to_identifier: room.uniq_id,
        })
      } else {
        joinPayload = {
          ...item,
          duration: item.duration + draggingInfo.duration,
          duration_time_unit_count:
            item.duration_time_unit_count + draggingInfo.duration_time_unit_count,
        }

        onItemJoin({
          join_from_identifier: draggingInfo.uniq_id,
          join_to_identifier: joinPayload.uniq_id,
        })
      }

      update([
        joinPayload,
        {
          ...draggingInfo,
          delete: true,
        },
      ])

      handleDrag({
        ...draggingInfo,
        delete: true,
      })

      celarBgColor()
      setIsOverlap(false)
    }
  }, [isDragging])

  ///////////////////
  // tool tip
  ///////////////////
  const createDetailTxt = () => {
    let txt
    if (item.tag === 'cleaning') {
      txt = `${item.name} ${item.duration}分`
    } else {
      txt = `${item.name}／${item.duration}分`
    }

    return txt
  }

  const createDevideLeftlTxt = () => {
    if (item.tag === 'cleaning') {
      return ''
    }

    if (divideIndexRef.current == -1) {
      return ''
    }

    return `${divideIndexRef.current * UNIT_TIME_MINUTES}分`
  }

  const createDevideRightlTxt = () => {
    if (item.tag === 'cleaning') {
      return ''
    }

    const newTime = item.duration_time_unit_count - divideIndexRef.current
    return `${newTime * UNIT_TIME_MINUTES}分`
  }

  const [itemDetailTxt, setItemDetailTxt] = useState('')
  const [itemDevideLeftTxt, setItemDevideLeftTxt] = useState('')
  const [itemDevideRightTxt, setItemDevideRightTxt] = useState('')
  useEffect(() => {
    if (!isDevidingSelf) {
      setItemDetailTxt(createDetailTxt())
      setItemDevideLeftTxt(createDetailTxt())
    } else {
      setItemDevideLeftTxt(createDevideLeftlTxt())
      setItemDevideRightTxt(createDevideRightlTxt())
    }
  }, [isDevidingSelf, divideIndexRef.current, item])

  const [timeToolTip, setTimeToolTip] = useState('')
  useEffect(() => {
    if (
      isDeviding ||
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

    setTimeToolTip(`${formattedTimeStart} ~ ${formattedTimeEnd}`)
  }, [timeIndex, isDeviding, item, scheduleStartTimeHH])

  const [isHovered, setIsHovered] = useState(false)

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showDIff, setShowDIff] = useState(0)

  useEffect(() => {
    if (position.x < (window.innerWidth * 4) / 5) {
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

  const isDivideble = item.duration_time_unit_count > 1

  return (
    <div
      ref={myRootRef}
      className={`group flex h-[25px] ${item.color}  justify-between rounded border border-white relative ${
        isDevidingSelf ? 'z-[1000]' : isDraggingLocal ? 'z-[100]' : isHovered ? 'z-[63]' : 'z-[62]'
      } transition-opacity duration-500 ease-out ${mounted ? 'opacity-100' : 'opacity-0'} min-w-[2%]`}
      style={{ width: `${widthPercent}%` }}
      onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`h-full w-full text-white text-xs items-center mt-1 overflow-hidden text-ellipsis whitespace-nowrap select-none pl-1
        ${isDragging ? 'pointer-events-none' : 'pointer-events-auto'} 
        ${!isDisableClick ? 'cursor-pointer' : ''}`}
        {...(!isDisableClick ? { onMouseDown: e => e.button === 0 && handleClick(e) } : {})}
      >
        {itemDetailTxt}
      </div>
      {isDivideble && (
        <div
          className={`top-0 right-0 h-full w-1 bg-transparent ${!isDisableClick ? 'cursor-ew-resize' : ''}`}
          {...(!isDisableClick && !isDevidingSelf
            ? { onMouseDown: e => e.button === 0 && handleDeviding(e) }
            : {})}
        ></div>
      )}
      <div
        ref={devideLineRef}
        className={`h-full absolute right-0 w-[2px] bg-white pointer-events-none ${isDevidingSelf ? 'block' : 'hidden'}`}
      ></div>
      {!isDevidingSelf && (!isDragging || (isDragging && isDraggingLocal)) && (
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
          {itemDevideLeftTxt}
        </div>
      )}

      {isDevidingSelf && (
        <div
          className='fixed translate-y-[-101%] bg-green-500 text-white text-xs p-1 rounded whitespace-nowrap z-[2147483647] pointer-events-none transition-opacity duration-350 ease-in-out opacity-0 group-hover:opacity-100'
          style={
            position.x === 0 && position.y === 0
              ? { opacity: 0 }
              : { left: position.x - showDIff + 5, top: position.y - 5 }
          }
        >
          {itemDevideLeftTxt} ／ {itemDevideRightTxt}
        </div>
      )}
    </div>
  )
}
