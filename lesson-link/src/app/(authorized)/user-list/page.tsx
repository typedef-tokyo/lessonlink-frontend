'use client'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect } from 'react'
import Loading from '@/app/_components/indicator/Loading'
import Header from '@/app/(authorized)/_components/Header'
import { showApiError, showSuccess } from '@/app/lib/notification'
import { apiClient, apiHooks } from '@/app/lib/zodios'
import { schemas } from '@/generated/api'
import { UserAddFormValue } from './_components/UserAddModalContent'
import { UserEditFormValue } from './_components/UserEditModalContent'
import { UserListTemplate } from './_components/UserListTemplate'

const UserList = () => {
  const { data: users, error, isLoading, refetch } = apiHooks.useGetUserlist()

  const { mutateAsync: postUser } = apiHooks.usePostUser()
  const { mutateAsync: putUser } = apiHooks.usePutUser()

  const [userAddOpened, { open: userAddOpen, close: userAddClose }] = useDisclosure(false)
  const userAddModalProps = {
    opened: userAddOpened,
    open: userAddOpen,
    close: userAddClose,
  }

  const [userEditOpened, { open: userEditOpen, close: userEditClose }] = useDisclosure(false)
  const userEditModalProps = {
    opened: userEditOpened,
    open: userEditOpen,
    close: userEditClose,
  }

  const [userDeleteOpened, { open: userDeleteOpen, close: userDeleteClose }] = useDisclosure(false)
  const userDeleteModalProps = {
    opened: userDeleteOpened,
    open: userDeleteOpen,
    close: userDeleteClose,
  }

  const handleOnUserAddSubmit = (values: UserAddFormValue) => {
    const addUserData = schemas.controller_UserAddRequestData.parse(values)

    postUser(addUserData)
      .then(success => {
        refetch()
        showSuccess('', success.msg)
        userAddClose()
      })
      .catch(error => {
        showApiError(error)
      })
  }

  const handleOnUserUpdateSubmit = (values: UserEditFormValue) => {
    const updateUserData = schemas.controller_UserUpdateRequestData.parse(values)

    putUser(updateUserData)
      .then(success => {
        refetch()
        showSuccess('', success.msg)
        userEditClose()
      })
      .catch(error => {
        showApiError(error)
      })
  }

  const handleOnUserDeleteSubmit = (userId: number) => {
    apiClient
      .deleteUserUserid(undefined, { params: { userid: String(userId) } })
      .then(success => {
        refetch()
        showSuccess('', success.msg)
      })
      .catch(err => {
        showApiError(err)
      })
  }

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  return (
    <div className='min-h-screen h-full flex flex-col'>
      <Header />
      {isLoading && <Loading />}
      {users && (
        <div className='flex flex-col h-full w-full flex-grow overflow-y-auto'>
          <UserListTemplate
            users={users}
            onUserAddSubmit={handleOnUserAddSubmit}
            onUserUpdateSubmit={handleOnUserUpdateSubmit}
            onUserDeleteSubmit={handleOnUserDeleteSubmit}
            userAddmodal={userAddModalProps}
            userEditmodal={userEditModalProps}
            userDeletemodal={userDeleteModalProps}
          />
        </div>
      )}
    </div>
  )
}

export default UserList
