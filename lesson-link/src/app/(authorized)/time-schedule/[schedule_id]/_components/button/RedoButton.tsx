'use client'
import { Button } from '@mantine/core'
import { IconSquareRoundedArrowRightFilled } from '@tabler/icons-react'
import React from 'react'

type Props = {
  redo: () => void
  disabled: boolean
}

export const RedoButton = ({ redo, disabled }: Props) => {
  return (
    <Button
      className='mr-2 bg-transparent hover:bg-transparent cursor-pointer pl-2 pr-2'
      onClick={() => redo()}
      disabled={disabled}
    >
      <div className='flex flex-col'>
        <IconSquareRoundedArrowRightFilled size={20} />
        <div
          className={`flex justify-center mt-1 ${disabled ? '#B0B0B0' : 'text-white'} text-[10px]`}
        >
          進む
        </div>
      </div>
    </Button>
  )
}
