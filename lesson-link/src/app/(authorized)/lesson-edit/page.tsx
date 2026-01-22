'use client'
import { CAMPUSES } from '@constants/Constants'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import Loading from '@/app/_components/indicator/Loading'
import { showApiError, showSuccess } from '@/app/lib/notification'
import { apiClient, apiHooks } from '@/app/lib/zodios'
import { schemas } from '@/generated/api'
import { LessonAddFormValue } from './_components/LessonAddModalContent'
import { LessonEditHeader } from './_components/LessonEditHeader'
import { LessonEditFormValue } from './_components/LessonEditModalContent'
import { LessonListTemplate } from './_components/LessonListTemplate'

const MasterEdit = () => {
  const [campus, setCampus] = useState<CAMPUSES>('shinjuku')
  const [campusName, setCampusName] = useState('')

  const {
    data: campuses,
    error: campusError,
    isLoading: campusLoading,
  } = apiHooks.useGetCampuslist()

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
    data: lessons,
    error: lessonsError,
    isLoading: lessonsLoading,
    refetch: lessonsRefetch,
  } = apiHooks.useGetLessonCampuslist({ params: { campus: campus } })

  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false)
  const addModalProps = {
    opened: addOpened,
    open: addOpen,
    close: addClose,
  }

  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false)
  const editModalProps = {
    opened: editOpened,
    open: editOpen,
    close: editClose,
  }
  const handleOnLessonAddSubmit = (values: LessonAddFormValue) => {
    const updateAddData = schemas.controller_LessonAddRequestData.parse(values)

    apiClient
      .postLessonCampus(updateAddData, { params: { campus: campus } })
      .then(success => {
        lessonsRefetch()
        showSuccess('', success.msg)
        editClose()
      })
      .catch(error => {
        showApiError(error)
      })
  }

  const handleOnLessonUpdateSubmit = (lessonid: number, values: LessonEditFormValue) => {
    const updateEditData = schemas.controller_LessonEditRequestData.parse(values)

    apiClient
      .patchLessonLessonid(updateEditData, { params: { lessonid: String(lessonid) } })
      .then(success => {
        lessonsRefetch()
        showSuccess('', success.msg)
        editClose()
      })
      .catch(error => {
        showApiError(error)
      })
  }

  useEffect(() => {
    if (campusError) {
      showApiError(campusError)
    }
    if (lessonsError) {
      showApiError(lessonsError)
    }
  }, [campusError, lessonsError])

  useEffect(() => {
    if (campusError) {
      showApiError(campusError)
    }
    if (lessonsError) {
      showApiError(lessonsError)
    }
  }, [campusError, lessonsError])

  return (
    <div className='h-full flex flex-col'>
      {(lessonsLoading || campusLoading) && <Loading />}
      {campuses && (
        <LessonEditHeader selectCampusName={campus} setCampus={setCampus} campuses={campuses} />
      )}

      <div className='flex flex-col w-[50%] mt-5 mb-5 mx-auto flex-grow overflow-hidden'>
        {lessons && (
          <LessonListTemplate
            campusName={campusName}
            lessonList={lessons}
            onEditAddSubmit={handleOnLessonAddSubmit}
            onEditUpdateSubmit={handleOnLessonUpdateSubmit}
            masterAddmodal={addModalProps}
            masterEditmodal={editModalProps}
          />
        )}
      </div>
    </div>
  )
}

export default MasterEdit
