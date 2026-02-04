'use client'

import { Button } from '@mantine/core'
import React from 'react'

type Props = {
  title: string
  tag: Tag
  onAction: (tag: Tag) => void
  onClose: () => void
}

export type Tag = 'duplicate' | 'delete'

export const ActionModalContent = ({ title, tag, onAction, onClose }: Props) => {
  const actionName = tag === 'duplicate' ? '複製' : '削除'

  return (
    <>
      <div>
        {title}を{actionName}しますか？
      </div>
      <div className='mt-10 flex items-end justify-end'>
        <Button
          className='w-2/6 bg-themeColor hover:bg-hoverThemeColor rounded mr-3'
          type='submit'
          onClick={() => {
            onAction(tag)
            onClose()
          }}
        >
          <div className="text-center text-white text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
            {actionName}
          </div>
        </Button>
        <Button className='w-2/6 bg-white rounded' variant='default' onClick={() => onClose()}>
          <div className="text-center text-[#222222] text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
            キャンセル
          </div>
        </Button>
      </div>
    </>
  )
}
