import { Button, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { MenuItem, TextField } from '@mui/material'
import React from 'react'
import { z } from 'zod'
import { PasswordField } from '@/app/(authorized)/_components/PasswordInputMUI'
import { schemas } from '@/generated/api'
import { RoleOptions } from '../../../_components/Constants'

type Props = {
  onSubmit: (values: Zod.infer<typeof schemas.controller_UserAddRequestData>) => void
  onClose: () => void
}

export type UserAddFormValue = Zod.infer<typeof schemas.controller_UserAddRequestData>

export const UserAddModalContent = ({ onSubmit, onClose }: Props) => {
  const passwordSchema = z.string().regex(/^[\x21-\x7E]{6,}$/, {
    message: 'パスワードは6文字以上に設定してください。英数字記号が使用可能です',
  })
  const form = useForm<UserAddFormValue>({
    initialValues: {
      name: '',
      user_name: '',
      password: '',
      confirm_password: '',
      role_key: 'viewer',
    },
    validate: {
      name: value => (value.length <= 0 ? '名前が未入力です' : null),
      user_name: value => (value.length <= 0 ? 'ユーザーネームが未入力です' : null),
      password: (value, values) => {
        if (!passwordSchema.safeParse(value).success) {
          return 'パスワードは6文字以上で、英数字・記号を含めてください。'
        }
        if (value.length <= 0) {
          return 'パスワードが未入力です'
        }

        if (value !== values.confirm_password) {
          return 'パスワードと確認用パスワードが一致しません'
        }
        return null
      },
      confirm_password: (value, values) => {
        if (value.length <= 0) {
          return '確認用パスワードが未入力です'
        }

        if (value !== values.password) {
          return 'パスワードと確認用パスワードが一致しません'
        }
        return null
      },
    },
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <div className='pl-3.5 pr-3.5 pb-5'>
        <Stack gap={30} mt='sm'>
          <TextField
            label='名前'
            placeholder=''
            autoComplete='off'
            required
            inputProps={{ required: false }}
            size='small'
            {...form.getInputProps('name')}
            helperText={form.getInputProps('name').error}
            fullWidth
          />
          <TextField
            label='ユーザーネーム'
            placeholder=''
            autoComplete='off'
            required
            inputProps={{ required: false }}
            size='small'
            {...form.getInputProps('user_name')}
            helperText={form.getInputProps('user_name').error}
            fullWidth
            onChange={e => {
              const halfWidth = e.target.value.replace(/[！-～]/g, s =>
                String.fromCharCode(s.charCodeAt(0) - 0xfee0),
              )
              const sanitized = halfWidth.replace(/[^\x20-\x7E]/g, '')
              form.setFieldValue('user_name', sanitized)
            }}
          />

          <PasswordField
            form={form}
            label='パスワード'
            inputPropsName='password'
            description={form.getInputProps('password').error ?? ''}
          />
          <PasswordField
            form={form}
            label='確認用パスワード'
            inputPropsName='confirm_password'
            description={form.getInputProps('confirm_password').error ?? ''}
          />

          <TextField
            select
            label='権限'
            required
            size='small'
            fullWidth
            value={form.values.role_key}
            onChange={e => form.setFieldValue('role_key', e.target.value)}
          >
            {RoleOptions.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
