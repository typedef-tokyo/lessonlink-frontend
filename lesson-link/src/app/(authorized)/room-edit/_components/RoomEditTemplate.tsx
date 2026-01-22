'use client'

import { Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useEffect } from 'react'
import { schemas } from '@/generated/api'
import { RoomEditTable } from './RoomEditTable'

export type RoomEditFormValue = Zod.infer<typeof schemas.controller_RoomEditRequestData>

type Props = {
  campusName: string
  rooms: Zod.infer<typeof schemas.presenter_RoomListDTO>[]
  onSubmit: (values: RoomEditFormValue) => void
}

export const RoomEditTemplate = ({ campusName, rooms, onSubmit }: Props) => {
  const form = useForm<RoomEditFormValue>({
    initialValues: {
      room_list: rooms,
    },
    validate: values => {
      const errors: Record<string, string | null> = {}

      values.room_list.forEach((item, index) => {
        if (item.room_name.replace(/[\s\u3000]/g, '').length <= 0) {
          errors[`room_list.${index}.room_name`] = '名前が未入力です'
        }
      })
      return errors
    },
  })

  useEffect(() => {
    form.setValues({
      room_list: rooms,
    })
  }, [rooms])

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className='flex overflow-auto custom-scrollbar'>
      <div className='flex flex-col mt-16 mb-5 ml-28 mr-28 flex-grow'>
        <div className='flex flex-col mt-8 w-max-[40%] justify-center mx-auto'>
          <div className='flex justify-between items-end'>
            <div>
              <div className="text-[#222222] text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
                {campusName}キャンパス：講座ルーム編集
              </div>
              <div className='text-sm'>
                名称が長い場合、画面上では一部が「...」で省略表示されることがあります。
                <br />
                全体を確認したい場合は、カーソルを合わせるとツールチップで表示されます。
              </div>
            </div>
            <Button className='bg-themeColor hover:bg-hoverThemeColor rounded' type='submit'>
              <div className="text-center text-white text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
                保存
              </div>
            </Button>
          </div>

          <div className='flex mt-8 w-max-[40%] justify-center'>
            <div className='flex-grow min-w-[140px]'>
              <div className='flex justify-center border-b border-gray-300 p-2 mb-5 text-white'>
                講座ルーム
              </div>
              <RoomEditTable form={form} />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
