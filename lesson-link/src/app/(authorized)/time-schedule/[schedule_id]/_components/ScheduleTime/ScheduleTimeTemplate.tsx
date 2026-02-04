'use client'

import { WorkTimeHours } from '@constants/Constants'
import { Button, Select } from '@mantine/core'
import React, { useState } from 'react'
import { showError } from '@/app/lib/notification'
import { RoomItem } from '../../../types'

type Props = {
  initialScheduleStartTime: number
  initialScheduleEndTime: number
  handleOnScheduleTimeSave: (startTime: number, endTime: number) => void
  roomItemList: Array<RoomItem>
}

const exitsItemsWithinDisableRange = (
  items: RoomItem[],
  newStartTime: number,
  newEndTime: number,
): boolean => {
  return items.some(
    item =>
      item.start_time_hh < newStartTime ||
      item.end_time_hh > newEndTime ||
      (item.end_time_hh === newEndTime && item.end_time_mm > 0),
  )
}

export const ScheduleTimeTemplate = ({
  initialScheduleStartTime,
  initialScheduleEndTime,
  roomItemList,
  handleOnScheduleTimeSave,
}: Props) => {
  const [startTimeSelected, setStartTimeSelected] = useState<string | null>(
    initialScheduleStartTime.toString(),
  )
  const [endTimeSelected, setEndTimeSelected] = useState<string | null>(
    initialScheduleEndTime.toString(),
  )
  const [startTimeSelectedError, setStartTimeSelectedError] = useState<string | null>(null)
  const [endTimeSelectedError, setEndTimeSelectedError] = useState<string | null>(null)

  const onClickUpdate = () => {
    setStartTimeSelectedError(null)
    setEndTimeSelectedError(null)

    if (!startTimeSelected) {
      setStartTimeSelectedError('開始時刻を選択してください')
    }

    if (!endTimeSelected) {
      setEndTimeSelectedError('終了時刻を選択してください')
    }

    if (!startTimeSelected || !endTimeSelected) return

    const startHour = parseInt(startTimeSelected, 10)
    const endHour = parseInt(endTimeSelected, 10)

    if (startHour > 23) {
      setStartTimeSelectedError('講座開始時刻は23時までに開始する必要があります')
      return
    }

    if (startHour >= endHour) {
      setEndTimeSelectedError('講座終了時刻は開始時刻後を設定してください')
      return
    }

    if (exitsItemsWithinDisableRange(roomItemList, startHour, endHour)) {
      showError(
        '',
        `講座に時間外のアイテムがあります。${startHour}時～${endHour}時以内に配置してください。`,
      )
      return
    }

    handleOnScheduleTimeSave(startHour, endHour)
  }

  return (
    <div className='pl-3.5 pr-3.5 pb-5'>
      <Select
        className='w-[200px]'
        label='利用開始時刻'
        placeholder=''
        data={WorkTimeHours}
        value={startTimeSelected}
        onChange={setStartTimeSelected}
        error={startTimeSelectedError}
        onFocus={() => setStartTimeSelectedError(null)}
      />

      <Select
        className='w-[200px] mt-5'
        label='利用終了時刻'
        placeholder=''
        data={WorkTimeHours}
        value={endTimeSelected}
        onChange={setEndTimeSelected}
        error={endTimeSelectedError}
        onFocus={() => setEndTimeSelectedError(null)}
      />

      <div className='mt-10 flex items-end justify-end'>
        <Button
          className='w-2/6 bg-themeColor hover:bg-hoverThemeColor rounded'
          type='button'
          onClick={() => onClickUpdate()}
        >
          <div className="text-center text-white text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
            保存
          </div>
        </Button>
      </div>
    </div>
  )
}
