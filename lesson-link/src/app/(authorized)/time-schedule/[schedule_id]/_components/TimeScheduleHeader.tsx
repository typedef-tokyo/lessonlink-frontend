'use client'
import { TextInput } from '@mantine/core'
import { IconClockEdit, IconDeviceFloppy } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { HeaderMenu } from '@/app/(authorized)/_components/HeaderMenu'
import { schemas } from '@/generated/api'
import { RedoButton } from './button/RedoButton'
import { UndoButton } from './button/UndoButton'

type TitleWipRequest = Zod.infer<typeof schemas.controller_ScheduleSaveTitleRequestData>
export type TitleValues = Omit<TitleWipRequest, 'history_index'> &
  Partial<Pick<TitleWipRequest, 'history_index'>>

type Props = {
  title: string
  setTitle: (t: string) => void
  historyIndex: number
  selectHistoryIndex: number
  countUpHistory: () => void
  countDownHistory: () => void
  onSave: () => void
  onBack: () => void
  isDisableClick: boolean
  openPrint: () => void
  sxheduleTimeOpen: () => void
  handleOnTitleWipUpdate: (values: TitleValues) => void
}

const TimeScheduleHeader = ({
  title,
  setTitle,
  historyIndex,
  selectHistoryIndex,
  countUpHistory,
  countDownHistory,
  onSave,
  onBack,
  isDisableClick,
  openPrint,
  sxheduleTimeOpen,
  handleOnTitleWipUpdate,
}: Props) => {
  const [localTitle, setLocalTitle] = useState(title)

  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  const handleBlur = () => {
    setFocused(false)
    if (localTitle !== title) {
      setTitle(localTitle)
    }
  }

  const undo = () => {
    const beforeIndex = selectHistoryIndex - 1
    if (beforeIndex < 1) {
      return
    }

    countDownHistory()
  }

  const redo = () => {
    const afterIndex = selectHistoryIndex + 1
    if (afterIndex > historyIndex) {
      return
    }

    countUpHistory()
  }

  const iconClockEdit = <IconClockEdit className='text-white' />

  const undoDisabled = selectHistoryIndex === 1
  const redoDisabled = selectHistoryIndex === historyIndex

  const [focused, setFocused] = useState(false)

  const saveTitle = () => {
    handleOnTitleWipUpdate({
      title: localTitle,
    })
  }

  return (
    <header className='bg-themeColor h-[9vh] min-h-[73px] justify-between pt-5 pb-2 px-9 flex flex-col items-center flex-shrink-0'>
      <div className='w-full flex'>
        <div className='flex flex-1 items-center'>
          <div className='w-24'>
            <img src='/images/lessonlink.png' alt='' />
          </div>

          <div className='flex h-8 items-center ml-7 w-80'>
            <TextInput
              className='flex-1'
              variant='unstyled'
              value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={handleBlur}
              readOnly={isDisableClick}
              rightSection={
                !isDisableClick &&
                focused && (
                  <IconDeviceFloppy
                    className='text-white cursor-pointer'
                    onMouseDown={e => e.preventDefault()}
                    onClick={saveTitle}
                  />
                )
              }
              styles={{
                input: {
                  color: 'white',
                  borderBottom: '1px solid #FFFFFF',
                  background: 'transparent',
                  borderRadius: 0,
                  paddingLeft: 0,
                  paddingRight: focused ? 32 : 0,
                  boxShadow: 'none',
                  '&:focus': {
                    borderBottom: '1px solid #FFFFFF',
                  },
                },
              }}
            />
          </div>
          <div
            className={`ml-4 text-white text-sm font-light font-['Hiragino Kaku Gothic Pro'] leading-snug tracking-wide ${!isDisableClick ? 'cursor-pointer' : ''}`}
            onClick={!isDisableClick ? () => sxheduleTimeOpen() : undefined}
          >
            {iconClockEdit}
          </div>
        </div>
        <div className='flex flex-1 h-full items-center justify-end select-none'>
          {!isDisableClick && (
            <>
              <UndoButton undo={undo} disabled={undoDisabled} />
              <RedoButton redo={redo} disabled={redoDisabled} />
            </>
          )}
          {!isDisableClick && (
            <div
              className="mr-5 text-white text-sm font-light font-['Hiragino Kaku Gothic Pro'] leading-snug tracking-wide cursor-pointer"
              onClick={() => onSave()}
            >
              保存
            </div>
          )}
          <div
            className="mr-5 text-white text-sm font-light font-['Hiragino Kaku Gothic Pro'] leading-snug tracking-wide cursor-pointer"
            onClick={() => openPrint()}
          >
            印刷
          </div>
          <div
            className="mr-5 text-white text-sm font-light font-['Hiragino Kaku Gothic Pro'] leading-snug tracking-wide cursor-pointer"
            onClick={() => onBack()}
          >
            戻る
          </div>
          <HeaderMenu />
        </div>
      </div>
    </header>
  )
}

export default TimeScheduleHeader
