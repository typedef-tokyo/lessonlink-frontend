'use client'

import { OWNER } from '@constants/Constants'
import { Button, Modal, Table } from '@mantine/core'
import React, { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { schemas } from '@/generated/api'
import { UserAddModalContent } from './UserAddModalContent'
import { UserDeleteModalContent } from './UserDeleteModalContent'
import { UserEditModalContent } from './UserEditModalContent'

type Props = {
  users: Zod.infer<typeof schemas.presenter_UserListResponse>
  onUserAddSubmit: (values: Zod.infer<typeof schemas.controller_UserAddRequestData>) => void
  onUserUpdateSubmit: (values: Zod.infer<typeof schemas.controller_UserUpdateRequestData>) => void
  onUserDeleteSubmit: (userId: number) => void
  userAddmodal: {
    opened: boolean
    open: () => void
    close: () => void
  }
  userEditmodal: {
    opened: boolean
    open: () => void
    close: () => void
  }
  userDeletemodal: {
    opened: boolean
    open: () => void
    close: () => void
  }
}

export const UserListTemplate = ({
  users,
  onUserAddSubmit,
  onUserUpdateSubmit,
  onUserDeleteSubmit,
  userAddmodal,
  userEditmodal,
  userDeletemodal,
}: Props) => {
  const [editUserID, setEditUserID] = useState<number | null>(null)
  const [deleteUserID, setDeleteUserID] = useState<number | null>(null)

  const onClickEdit = (userID: number) => {
    userEditmodal.open()
    setEditUserID(userID)
  }

  const onClickDelete = (userID: number) => {
    userDeletemodal.open()
    setDeleteUserID(userID)
  }

  const { user } = useUser()
  if (!user) return

  const isOwner = user.roleKey === OWNER

  const rows = users.users.map(userData => (
    <Table.Tr key={userData.id}>
      <Table.Td className='min-w-[10rem]'>{userData.name}</Table.Td>
      <Table.Td className='min-w-[10rem]'>{userData.user_name}</Table.Td>
      <Table.Td className='min-w-[10rem]'>{userData.role_name}</Table.Td>
      <Table.Td className='min-w-[10rem]'>
        <Button
          variant='outline'
          color='#20BEFF'
          radius='md'
          className='bg-[#F9F9F9]'
          onClick={() => onClickEdit(userData.id)}
        >
          編集
        </Button>
        {isOwner && (
          <Button
            variant='outline'
            color='#FF7777'
            radius='md'
            className='bg-[#F9F9F9] ml-3'
            onClick={() => onClickDelete(userData.id)}
            disabled={userData.id === user.id}
          >
            削除
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <div className='flex flex-col items-center mt-16 mb-5 flex-grow overflow-hidden w-full'>
      <div className='w-full max-w-screen-lg px-4'>
        <div className='flex flex-col w-full flex-grow min-h-0' style={{ height: '80vh' }}>
          <div className='flex justify-between items-center'>
            <div className="text-[#222222] text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
              ユーザー設定
            </div>
            <Button
              fullWidth
              className={`${isOwner ? 'bg-themeColor hover:bg-hoverThemeColor' : ''} rounded w-full max-w-xs h-[3.75rem]`}
              onClick={userAddmodal.open}
              disabled={!isOwner}
            >
              <div className="text-center text-white text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
                ＋ 新規ユーザー追加
              </div>
            </Button>
          </div>
          <div className='mt-14 flex-grow min-h-0'>
            <div className='overflow-auto custom-scrollbar h-full' style={{ maxHeight: '100%' }}>
              {/* テーブルだけスクロール */}
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className='w-1/4'>名前</Table.Th>
                    <Table.Th className='w-1/4'>ユーザーネーム</Table.Th>
                    <Table.Th className='w-1/4'>権限</Table.Th>
                    <Table.Th className='w-1/4'>アクション</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </div>
          </div>
        </div>
        <Modal
          opened={userAddmodal.opened}
          onClose={userAddmodal.close}
          title='新規ユーザー追加'
          centered
        >
          <UserAddModalContent onSubmit={onUserAddSubmit} onClose={userAddmodal.close} />
        </Modal>
        <Modal
          opened={userEditmodal.opened}
          onClose={userEditmodal.close}
          title='ユーザー編集'
          centered
        >
          <UserEditModalContent
            userID={editUserID}
            onClose={userEditmodal.close}
            onSubmit={onUserUpdateSubmit}
          />
        </Modal>
        <Modal
          opened={userDeletemodal.opened}
          onClose={userDeletemodal.close}
          title='以下のユーザーを削除しますか？'
          centered
        >
          <UserDeleteModalContent
            userID={deleteUserID}
            onClose={userDeletemodal.close}
            onSubmit={onUserDeleteSubmit}
          />
        </Modal>
      </div>
    </div>
  )
}
