'use client'

import { HOUR_UNIT, LESSON_COLOR } from '@constants/Constants'
import React, { useEffect, useState } from 'react'
import { DraggingInfo, ItemPayload, LessonItem } from '@/app/(authorized)/time-schedule/types'
import { FilterName, SetFilterName } from './filter/FilterName'
import { MaterialTimebar } from './MaterialTimebar'
import {
  SortItemListByDurationTime,
  SortLessonListByName,
  SortMenu,
  ToHiragana,
} from './sort/SortMenu'
import { TaskTimebar } from './TaskTimebar/TaskTimebar'
import { ItemDivideValues, ItemJoinValues } from './TimeScheduleTemplate'

type Props = {
  lessonList: Array<LessonItem>
  update: (payload: ItemPayload | ItemPayload[]) => void
  isDragging: boolean
  setIsDragging: (args: { flag: boolean }) => void
  handleDrag: (payload: DraggingInfo) => void
  draggingInfo: DraggingInfo | null
  isDeviding: boolean | string
  setIsDeviding: (state: false | string) => void
  timeIndex: { startIndex: number; endIndex: number }
  isDisableClick: boolean
  scheduleStartTimeHH: number
  onItemDeivde: (values: ItemDivideValues) => void
  onItemJoin: (values: ItemJoinValues) => void
}

export const LessonList = ({
  lessonList,
  update,
  isDragging,
  setIsDragging,
  handleDrag,
  draggingInfo,
  isDeviding,
  setIsDeviding,
  timeIndex,
  isDisableClick,
  scheduleStartTimeHH,
  onItemDeivde,
  onItemJoin,
}: Props) => {

  const [sortField, setSortField] = useState<'name' | 'time'>('time')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterKeyword, setFilterKeyword] = useState('')

  const [groupLesson, setGroupLesson] = useState<Map<number, LessonItem[]>>(new Map())

  useEffect(() => {
    if (lessonList.length === 0) {
      setGroupLesson(new Map())
      return
    }

    const normalizedKeyword = ToHiragana(filterKeyword.trim())

    const filtered =
      normalizedKeyword === ''
        ? lessonList
        : lessonList.filter(item => {
            const normalized = ToHiragana(item.name)
            return normalized.includes(normalizedKeyword)
          })

    const grouped =
      sortField === 'name'
        ? SortLessonListByName(filtered, sortOrder)
        : SortItemListByDurationTime(filtered, sortOrder)

    setGroupLesson(grouped)
  }, [lessonList, filterKeyword, sortField, sortOrder])

  let lessonMaxProcessMinutes = 0
  const firstGroup = SortItemListByDurationTime(lessonList, 'desc').values().next().value as
    | LessonItem[]
    | undefined
  if (firstGroup) {
    for (const item of firstGroup) {
      lessonMaxProcessMinutes += item.duration
    }
  } else {
    lessonMaxProcessMinutes = 60
  }

  const total_hour = Math.ceil(lessonMaxProcessMinutes / 60)
  const total_minutes = total_hour * HOUR_UNIT

  const sort = (field: 'name' | 'time', order: 'asc' | 'desc') => {
    setSortField(field)
    setSortOrder(order)
  }

  const filterName = (name: string) => {
    SetFilterName(lessonList, name, setFilterKeyword, sortField, sortOrder, setGroupLesson)
  }

  return (
    <div className='w-full h-[35%] p-4 resize-y overflow-auto min-h-[25%] max-h-[70%]'>
      <div className='w-full h-full flex flex-col bg-white rounded-md p-4 pb-3'>
        <div className='flex items-center mb-1'>
          <div className="text-[#222222] text-sm font-semibold font-['Hiragino Kaku Gothic Pro'] leading-snug tracking-wide">
            講座リスト
          </div>
          <div className='ml-1'>
            <SortMenu sort={sort} />
          </div>
          <div className='ml-3'>
            <FilterName name='講座' filter={filterName} />
          </div>
        </div>
        <div>
          <TaskTimebar maxTimeMinutes={lessonMaxProcessMinutes} />
        </div>
        <div className='w-full overflow-y-auto custom-scrollbar flex-grow'>
          {Array.from(groupLesson.entries()).map(([itemId, lessonList]) => (
            <div key={itemId} className='flex'>
              {lessonList.map(item => {
                item.color = LESSON_COLOR
                const widthPercent = (item.duration_time_unit_count / total_minutes) * 100
                return (
                  <MaterialTimebar
                    key={item.uniq_id}
                    item={item}
                    update={update}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    widthPercent={widthPercent}
                    handleDrag={handleDrag}
                    draggingInfo={draggingInfo}
                    isDeviding={isDeviding}
                    setIsDeviding={setIsDeviding}
                    timeLineParentWidth={null}
                    timeIndex={timeIndex}
                    isDisableClick={isDisableClick}
                    scheduleStartTimeHH={scheduleStartTimeHH}
                    maxEndTimeIndex={null}
                    onItemDeivde={onItemDeivde}
                    onItemJoin={onItemJoin}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
