'use client'
import { CAMPUSES } from '@constants/Constants'
import React, { useEffect, useState } from 'react'
import { showApiError, showSuccess } from '@/app/lib/notification'
import { apiHooks } from '@/app/lib/zodios'
import { schemas } from '@/generated/api'
import { RoomEditHeader } from './_components/RoomEditHeader'
import { RoomEditFormValue, RoomEditTemplate } from './_components/RoomEditTemplate'

const RoomEdit = () => {
  const [campus, setCampus] = useState<CAMPUSES>('shinjuku')
  const [campusName, setCampusName] = useState('')

  const { data: campuses, error, isLoading } = apiHooks.useGetCampuslist()

  const getCampusNameByKey = (key: string): string => {
    if (!campuses) {
      return ''
    }
    const campus = campuses.campuses.find(f => f.campus === key)
    return campus ? campus.campus_name : ''
  }

  useEffect(() => {
    if (campuses) {
      setCampusName(getCampusNameByKey(campus))
    }
  }, [campus])

  const {
    data: roomsData,
    error: roomError,
    isLoading: roomLoading,
    refetch,
  } = apiHooks.useGetRoomCampuslist({ params: { campus: campus } })

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
    if (roomError) {
      showApiError(roomError)
    }
  }, [error, roomError])

  const [rooms, setRooms] = useState<Zod.infer<typeof schemas.presenter_RoomListDTO>[]>([])

  useEffect(() => {
    if (roomsData) {
      setRooms(roomsData.rooms)
    }
  }, [roomsData])

  const { mutateAsync: postRoomEdit } = apiHooks.usePostRoomCampusedit({
    params: { campus: campus },
  })

  const onSubmit = (values: RoomEditFormValue) => {
    const updateData = {
      room_list: values.room_list.map(item => schemas.controller_RoomEditData.parse(item)),
    }

    postRoomEdit(updateData)
      .then(success => {
        showSuccess('', success.msg)
        refetch()
      })
      .catch(error => {
        showApiError(error)
      })
  }

  return (
    !isLoading &&
    !roomLoading &&
    !error &&
    !roomError &&
    campuses &&
    roomsData && (
      <div className='h-full w-full flex flex-col overflow-hidden'>
        <RoomEditHeader selectCampusName={campus} setCampus={setCampus} campuses={campuses} />
        <RoomEditTemplate campusName={campusName} rooms={rooms} onSubmit={onSubmit} />
      </div>
    )
  )
}

export default RoomEdit
