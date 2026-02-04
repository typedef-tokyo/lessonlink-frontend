import { Button, TextInput } from '@mantine/core'
import React, { useEffect } from 'react'
import { showApiError } from '@/app/lib/notification'
import { apiHooks } from '@/app/lib/zodios'
import { useUser } from '@/context/UserContext'

type Props = {
  userID: number | null
  onSubmit: (userId: number) => void
  onClose: () => void
}

export const UserDeleteModalContent = ({ userID, onSubmit, onClose }: Props) => {
  const { user } = useUser()
  if (!user) return
  if (!userID) return

  const { data, error, isLoading } = apiHooks.useGetUserUserid({
    params: { userid: String(userID) },
  })

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  const onClickDelete = (userId: number) => {
    onSubmit(userId)
    onClose()
  }

  return (
    !isLoading &&
    data && (
      <div className='pl-3.5 pr-3.5 pb-5'>
        <TextInput leftSectionPointerEvents='none' label='名前' value={`${data.name}`} readOnly />
        <TextInput
          mt='md'
          leftSectionPointerEvents='none'
          label='ユーザーネーム'
          value={`${data.user_name}`}
          readOnly
        />
        <div className='mt-10 flex items-end justify-end'>
          <Button
            className='w-2/6 bg-themeColor hover:bg-hoverThemeColor rounded mr-3'
            onClick={() => onClickDelete(userID)}
          >
            <div className="text-center text-white text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
              削除
            </div>
          </Button>
          <Button className='w-2/6 bg-white rounded' variant='default' onClick={onClose}>
            <div className="text-center text-[#222222] text-base font-light font-['Hiragino Kaku Gothic Pro'] leading-normal tracking-wide">
              キャンセル
            </div>
          </Button>
        </div>
      </div>
    )
  )
}
