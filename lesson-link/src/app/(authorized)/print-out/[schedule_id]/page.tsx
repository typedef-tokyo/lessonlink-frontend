'use client'

import { DURATIN_UNIT_HOUR } from '@constants/Constants'
import { Button } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Loading from '@/app/_components/indicator/Loading'
import { showApiError } from '@/app/lib/notification'
import { calcEndTime2Index, calcStartTime2Index } from '@/app/lib/util'
import { apiHooks } from '@/app/lib/zodios'
import { schemas } from '@/generated/api'
import { PrintTimeScheduleDetailTemplate } from './_components/PrintTimeScheduleDetailTemplate'
import { PrintItem, PrintRoomItem } from './_components/types'
import { ItemListView } from './ItemListView'

type Props = {
  params: {
    schedule_id: string
  }
}

const PrintOutTemplate = ({ params }: Props) => {
  const scheduleId = params.schedule_id

  const { data, error, isLoading } = apiHooks.useGetScheduleSchedule_id(
    {
      params: { schedule_id: scheduleId },
    },
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  const [printData, setPrintData] = useState<Array<PrintItem>>([])
  const [rooms, setRooms] = useState<Zod.infer<typeof schemas.presenter_ScheduleRoomDTO>[]>()
  const [roomItemList, setRoomItemList] = useState<Array<PrintRoomItem>>([])

  const getRoomName = (roomIndex: number): string => {
    if (!data?.rooms) return ''
    return data.rooms.find(room => room.room_index === roomIndex)?.room_name ?? ''
  }

  useEffect(() => {
    if (!data) return

    const groupedData: PrintItem[] = []

    data.room_lesson_list.forEach(item => {
      let group = groupedData.find(g => g.room_index === item.room_index)

      if (!group) {
        group = {
          room_index: item.room_index,
          room_name: getRoomName(item.room_index),
          items: [],
        }
        groupedData.push(group)
      }

      group.items.push({
        uniq_id: item.identifier,
        start_time_hh: item.start_time_hour,
        start_time_mm: item.start_time_minutes,
        end_time_hh: item.end_time_hour,
        end_time_mm: item.end_time_minutes,
        start_time_index: calcStartTime2Index(
          item.start_time_hour,
          item.start_time_minutes,
          data.schedule_start_time,
        ),
        end_time_index: calcEndTime2Index(
          item.end_time_hour,
          item.end_time_minutes,
          data.schedule_start_time,
        ),
        lesson_name: item.lesson_name,
        duration: item.duration,
      })
    })

    groupedData.forEach(group => {
      group.items.sort((a, b) => a.start_time_index - b.start_time_index)
    })

    setPrintData(groupedData)

    setRooms(data.rooms)

    setRoomItemList(
      data.room_lesson_list.map(item => {
        return {
          uniq_id: item.identifier,
          tag: item.item_tag as 'lesson' | 'cleaning',
          start_time_hh: item.start_time_hour,
          start_time_mm: item.start_time_minutes,
          end_time_hh: item.end_time_hour,
          end_time_mm: item.end_time_minutes,
          start_time_index: calcStartTime2Index(
            item.start_time_hour,
            item.start_time_minutes,
            data.schedule_start_time,
          ),
          end_time_index: calcEndTime2Index(
            item.end_time_hour,
            item.end_time_minutes,
            data.schedule_start_time,
          ),
          lesson_name: item.lesson_name,
          room_index: item.room_index,
          duration: item.duration,
          widthPercent: null,
        }
      }),
    )
  }, [data])

  const [workTime, setWorkTime] = useState<{
    lessonStartTimeHH: number
    workTimeDuration: number
  } | null>(null)

  const [printItemList, setPrintItemList] = useState<PrintRoomItem[][]>([])

  useEffect(() => {
    const getEndTimeIndex = (items: PrintRoomItem[]) => {
      if (items.length === 0) return null

      const times = items.map(item => ({
        end_time_index: item.end_time_index,
      }))

      const maxTime = times.reduce(
        (max, curr) => (curr.end_time_index > max.end_time_index ? curr : max),
        times[0],
      )

      return maxTime.end_time_index
    }

    if (!data) return

    const endTimeIndex = getEndTimeIndex(roomItemList)

    if (!endTimeIndex) return

    const lessonStartTimeHH = data.schedule_start_time

    let duration = endTimeIndex + 1
    duration = duration / 60

    if (duration < DURATIN_UNIT_HOUR) {
      duration = DURATIN_UNIT_HOUR
    }

    if (duration > DURATIN_UNIT_HOUR) {
      duration = Math.floor(duration / DURATIN_UNIT_HOUR) * DURATIN_UNIT_HOUR + DURATIN_UNIT_HOUR
    }

    setWorkTime({
      lessonStartTimeHH: lessonStartTimeHH,
      workTimeDuration: duration,
    })
  }, [roomItemList])

  useEffect(() => {
    if (!workTime) return

    const hourDivide = workTime.workTimeDuration / DURATIN_UNIT_HOUR

    const workItemList = roomItemList.map(item => ({ ...item }))

    const ROOM_END_TIME_INDEX = 60 * DURATIN_UNIT_HOUR - 1
    const ROOM_INDEX_LENGTH = 60 * DURATIN_UNIT_HOUR

    for (let i = 0; i < hourDivide; i++) {
      const workStartTimeIndex = i * ROOM_INDEX_LENGTH
      const workEndTimeIndex = workStartTimeIndex + ROOM_INDEX_LENGTH - 1

      const targetItems = workItemList.filter(
        item =>
          (item.start_time_index >= workStartTimeIndex &&
            item.start_time_index <= workEndTimeIndex) ||
          (item.start_time_index < workStartTimeIndex && item.end_time_index >= workStartTimeIndex),
      )

      const displayItems = targetItems.map(item => {
        let startTimeIndex = item.start_time_index
        if (startTimeIndex <= workStartTimeIndex) {
          startTimeIndex = 0
        } else {
          startTimeIndex = startTimeIndex - workStartTimeIndex
        }

        let endTimeIndex = item.end_time_index
        if (endTimeIndex >= workEndTimeIndex) {
          endTimeIndex = ROOM_END_TIME_INDEX
        } else {
          endTimeIndex = endTimeIndex - i * ROOM_INDEX_LENGTH
        }

        return {
          ...item,
          start_time_index: startTimeIndex,
          end_time_index: endTimeIndex,
        }
      })

      setPrintItemList(prev => [...prev, displayItems])
    }
  }, [workTime])

  const [onPageBreak, setOnPageBreak] = useState(true)

  const handlePrint = (pageBreak: boolean) => {
    setOnPageBreak(pageBreak)
    setTimeout(() => {
      window.print()
    }, 0)
  }

  return (
    <div className='w-full h-full overflow-y-auto print-container print:overflow-visible'>
      {isLoading && <Loading />}
      {data && workTime && rooms !== undefined && (
        <>
          <div className='print:hidden fixed flex flex-col top-10 right-10 z-[1000]'>
            <Button
              className='w-[8vw] h-[2vw] min-w-[180px] min-h-[30px] bg-green-400 hover:bg-green-700 rounded mt-3'
              onClick={() => handlePrint(false)}
            >
              印刷：改ページなし
            </Button>
            <Button
              className='w-[8vw] h-[2vw] min-w-[180px] min-h-[30px] bg-yellow-600 hover:bg-yellow-900 rounded mt-3'
              onClick={() => handlePrint(true)}
            >
              印刷：改ページあり
            </Button>
          </div>
          <ItemListView printData={printData} onPageBreak={onPageBreak} />
          {printItemList.map((itemList, index) => (
            <PrintTimeScheduleDetailTemplate
              key={index}
              roomItemList={itemList}
              rooms={rooms}
              startHH={workTime.lessonStartTimeHH + index * DURATIN_UNIT_HOUR}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default PrintOutTemplate
