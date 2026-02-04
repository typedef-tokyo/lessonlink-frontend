import { OWNER, RoleOptions } from '@constants/Constants'
import { Button, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { MenuItem, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { PasswordField } from '@/app/(authorized)/_components/PasswordInputMUI'
import { showApiError } from '@/app/lib/notification'
import { apiHooks } from '@/app/lib/zodios'
import { useUser } from '@/context/UserContext'
import { schemas } from '@/generated/api'

type Props = {
  userID: number | null
  onSubmit: (values: Zod.infer<typeof schemas.controller_UserUpdateRequestData>) => void
  onClose: () => void
}

export type UserEditFormValue = Zod.infer<typeof schemas.controller_UserUpdateRequestData>

export const UserEditModalContent = ({ userID, onClose, onSubmit }: Props) => {
  const { user } = useUser()
  if (!user) return

  const isOwner = user.roleKey === OWNER

  const { data, error, isLoading } = apiHooks.useGetUserUserid({
    params: { userid: String(userID) },
  })

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  const passwordSchema = z.string().regex(/^[\x21-\x7E]{6,}$/, {
    message: 'パスワードは6文字以上に設定してください。英数字記号が使用可能です',
  })
  const form = useForm<UserEditFormValue>({
    initialValues: {
      id: -1,
      display_name: '',
      user_name: '',
      password: '',
      confirm_password: '',
      role_key: 'viewer',
    },
    validate: {
      display_name: value => (value.length <= 0 ? '名前が未入力です' : null),
      user_name: value => (value.length <= 0 ? 'ユーザーネームが未入力です' : null),
      password: (value, values) => {
        if (value.length === 0 && values.confirm_password.length === 0) {
          return null
        }

        if (!passwordSchema.safeParse(value).success) {
          return 'パスワードは6文字以上に設定してください。英数字記号が使用可能です'
        }
        if (value !== values.confirm_password) {
          return 'パスワードと確認用パスワードが一致しません'
        }
        return null
      },
      confirm_password: (value, values) => {
        if (value !== values.password) {
          return 'パスワードと確認用パスワードが一致しません'
        }
        return null
      },
    },
  })

  useEffect(() => {
    if (data) {
      form.setValues({
        id: data.id,
        display_name: data.name,
        user_name: data.user_name,
        role_key: data.role_key || 'viewer',
      })
    }
  }, [data])

  return (
    !isLoading &&
    data && (
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
              {...form.getInputProps('display_name')}
              helperText={form.getInputProps('display_name').error}
              fullWidth
            />
            <TextField
              label='ユーザーネーム'
              placeholder=''
              autoComplete='off'
              size='small'
              {...form.getInputProps('user_name')}
              fullWidth
              disabled
              helperText='ユーザーネームは変更できません'
            />
            <PasswordField
              form={form}
              label='パスワード'
              inputPropsName='password'
              description={
                form.getInputProps('password').error ?? '変更しない場合は未入力のままにしてください'
              }
              required={false}
            />
            <PasswordField
              form={form}
              label='確認用パスワード'
              inputPropsName='confirm_password'
              description={
                form.getInputProps('confirm_password').error ??
                '変更しない場合は未入力のままにしてください'
              }
              required={false}
            />
            <TextField
              select
              label='権限'
              required
              size='small'
              fullWidth
              value={form.values.role_key}
              onChange={e => form.setFieldValue('role_key', e.target.value)}
              disabled={!isOwner}
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
  )
}
