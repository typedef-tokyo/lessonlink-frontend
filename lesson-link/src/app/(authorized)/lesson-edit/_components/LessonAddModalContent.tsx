import { EDITOR, OWNER } from '@constants/Constants'
import { Button, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { TextField } from '@mui/material'
import React from 'react'
import { z } from 'zod'
import { schemas } from '@/generated/api'

type Props = {
  onSubmit: (values: z.infer<typeof schemas.controller_LessonAddRequestData>) => void
  onClose: () => void
}

export type LessonAddFormValue = z.infer<typeof schemas.controller_LessonAddRequestData>

export const LessonAddModalContent = ({ onClose, onSubmit }: Props) => {
  const form = useForm({
    initialValues: {
      lesson_name: '',
      duration: 30,
    },
    validate: {
      lesson_name: val => (val.length === 0 ? '講座名を入力してください' : null),
      duration: val => (Number(val) < 30 ? '講座時間は10分以上を指定してください' : null),
    },
  })

  return (
    <form
      onSubmit={form.onSubmit(values =>
        onSubmit({
          lesson_name: values.lesson_name,
          duration: Number(values.duration),
        }),
      )}
    >
      <div className='pl-3.5 pr-3.5 pb-5'>
        <Stack gap={4} mt='sm'>
          <TextField
            label='講座名'
            required
            size='small'
            {...form.getInputProps('lesson_name')}
            fullWidth
          />
        </Stack>

        <Stack gap={4} mt='sm'>
          <TextField
            label='講座時間(分)'
            type='number'
            required 
            margin='normal'
            size='small'
            inputProps={{
              min: 30,
              max: 120,
            }}
            autoComplete='off'
            {...form.getInputProps('duration')}
            fullWidth
          />
        </Stack>

        <div className='mt-10 flex items-end justify-end'>
          <Button
            className='w-2/6 bg-themeColor hover:bg-hoverThemeColor rounded mr-3'
            type='submit'
          >
            <div className="text-center text-white text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
              保存
            </div>
          </Button>
          <Button className='w-2/6 bg-white rounded' variant='default' onClick={onClose}>
            <div className="text-center text-[#222222] text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
              キャンセル
            </div>
          </Button>
        </div>
      </div>
    </form>
  )
}
