'use client'
import { Button } from '@mantine/core'
import { IconSquareRoundedArrowLeftFilled } from '@tabler/icons-react'
import React from 'react'

type Props = {
  undo: () => void
  disabled: boolean
}

export const UndoButton = ({ undo, disabled }: Props) => {
  return (
    <Button
      className='mr-2 bg-transparent hover:bg-transparent cursor-pointer pl-2 pr-2'
      onClick={() => undo()}
      disabled={disabled}
    >
      <div className='flex flex-col'>
        <IconSquareRoundedArrowLeftFilled size={20} />
        <div
          className={`flex justify-center mt-1 ${disabled ? '#B0B0B0' : 'text-white'} text-[10px]`}
        >
          戻る
        </div>
      </div>
    </Button>
  )
}
