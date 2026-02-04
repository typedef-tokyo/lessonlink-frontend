'use client'

import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { schemas } from '@/generated/api'

type Props = {
  onSubmit: (values: Zod.infer<typeof schemas.controller_UserLoginParams>) => void
}

export type LoginFormValue = Zod.infer<typeof schemas.controller_UserLoginParams>

export const LoginTemplate = ({ onSubmit }: Props) => {
  const [visible, { toggle }] = useDisclosure(false)

  const form = useForm<LoginFormValue>({
    initialValues: {
      user_name: '',
      password: '',
    },
    validate: {
      user_name: value => (value.length <= 0 ? 'ログインIDが未入力です' : null),
      password: value => (value.length <= 0 ? 'パスワードが未入力です' : null),
    },
  })

  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <div className='flex h-screen w-screen'>
        <div className='flex-1 bg-white flex items-center justify-center relative'>
          <img src='/images/top/back.jpg' alt='' className='absolute h-full w-full object-cover' />
          <div
            className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
              show ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`w-full flex justify-center transition-opacity duration-500 ${
              show ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='w-[30%] z-[50]'>
              <div className="text-white text-[32px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-[44.80px]">
                <img src='/images/lessonlink.png' alt='' />
              </div>
              <div className='w-full mt-10'>
                <div className='w-full'>
                  <TextInput
                    leftSectionPointerEvents='none'
                    label='ユーザーネーム'
                    labelProps={{ style: { color: '#FFFFFF' } }}
                    placeholder=''
                    {...form.getInputProps('user_name')}
                    styles={{
                      input: {
                        height: '54px',
                        fontSize: '18px',
                      },
                    }}
                  />
                </div>
              </div>
              <div className='w-full mt-4'>
                <PasswordInput
                  label='パスワード'
                  labelProps={{ style: { color: '#FFFFFF' } }}
                  visible={visible}
                  onVisibilityChange={toggle}
                  {...form.getInputProps('password')}
                  styles={{
                    input: {
                      height: '54px',
                      fontSize: '18px',
                    },
                  }}
                />
              </div>
              <div className='w-full mt-10'>
                <Button
                  fullWidth
                  className='h-[60px] bg-themeColor hover:bg-hoverThemeColor'
                  type='submit'
                >
                  ログイン
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
