'use client'

import { WorkTimeHours } from '@constants/Constants'
import { Button, Select } from '@mantine/core'
import React, { useState } from 'react'

type Props = {
  buttonName: string
  onCreate: (startTimeHour: number, endTimeHour: number) => void
  showStartTimeSelects: boolean
}

export const ScheduleCreateTemplate = ({ buttonName, onCreate, showStartTimeSelects }: Props) => {
  const [startTimeSelected, setStartTimeSelected] = useState<string | null>(null)
  const [endTimeSelected, setEndTimeSelected] = useState<string | null>(null)
  const [startTimeSelectedError, setStartTimeSelectedError] = useState<string | null>(null)
  const [endTimeSelectedError, setEndTimeSelectedError] = useState<string | null>(null)

  const onClickCreate = () => {
    setStartTimeSelectedError(null)
    setEndTimeSelectedError(null)

    if (showStartTimeSelects) {
      if (!startTimeSelected) {
        setStartTimeSelectedError('開始時刻を選択してください')
      }
      if (!endTimeSelected) {
        setEndTimeSelectedError('終了時刻を選択してください')
      }
      if (!startTimeSelected || !endTimeSelected) return

      const startHour = parseInt(startTimeSelected, 10)
      const endHour = parseInt(endTimeSelected, 10)

      const minStart = Math.min(startHour, endHour)
      const maxStart = Math.max(startHour, endHour)

      if (minStart >= 24 && endHour >= 24) {
        setEndTimeSelectedError(
          '座学講座・実技講座開始時刻のいずれかは24時までに開始する必要があります',
        )
        setStartTimeSelectedError(
          '座学講座・実技講座開始時刻のいずれかは24時までに開始する必要があります',
        )
        return
      }

      if (minStart + 24 < maxStart) {
        if (startHour < endHour) {
          setEndTimeSelectedError('開始時刻は作業開始から24時間以内を選択してください')
        } else {
          setStartTimeSelectedError('開始時刻は作業開始から24時間以内を選択してください')
        }
        return
      }

      onCreate(startHour, endHour)
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center min-w-[300px]'>
      {showStartTimeSelects && (
        <div className='flex flex-col'>
          <div className='flex w-full'>
            <Select
              className='mr-5 w-[200px]'
              label='開始時刻'
              placeholder=''
              data={WorkTimeHours}
              value={startTimeSelected}
              onChange={setStartTimeSelected}
              error={startTimeSelectedError}
              onFocus={() => setStartTimeSelectedError(null)}
            />
            <Select
              className='mr-5 w-[200px]'
              label='終了時刻'
              placeholder=''
              data={WorkTimeHours}
              value={endTimeSelected}
              onChange={setEndTimeSelected}
              error={endTimeSelectedError}
              onFocus={() => setEndTimeSelectedError(null)}
            />
          </div>
        </div>
      )}

      <div className='flex mt-8 pb-10'>
        <Button
          fullWidth
          className='w-[230px] h-[60px] bg-themeColor hover:bg-hoverThemeColor rounded'
          onClick={() => onClickCreate()}
        >
          <div className="text-center text-white text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
            {buttonName}
          </div>
        </Button>
      </div>
    </div>
  )
}
