'use client'
import { ROUTES } from '@constants/Constants'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Loading from '@/app/_components/indicator/Loading'
import {
  dismissLoading,
  showApiError,
  showError,
  showLoading,
  showSuccess,
} from '@/app/lib/notification'
import { apiClient, apiHooks } from '@/app/lib/zodios'
import { schemas } from '@/generated/api'
import ScheduleListHeader from './_components/ScheduleListHeader'
import { ScheduleListTemplate } from './_components/ScheduleListTemplate'

type Props = {
  params: {
    campus: string
  }
}

const ScheduleList = ({ params }: Props) => {
  const campus = params.campus
  const router = useRouter()
  const [campusName, setCampusName] = useState('')

  const {
    data: campuses,
    error: campusError,
    isLoading: isCampusLoading,
  } = apiHooks.useGetCampuslist()

  useEffect(() => {
    if (campusError) {
      showApiError(campusError)
    }
  }, [campusError])

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
    data: schedules,
    error,
    isLoading,
    refetch,
  } = apiHooks.useGetSchedulelistCampus({ params: { campus: campus } })

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  const [scheduleAddOpened, { open: scheduleAddOpen, close: scheduleAddClose }] =
    useDisclosure(false)

  const { mutateAsync: postScheduleCampus } = apiHooks.usePostSchedulecreateCampus({
    params: { campus: campus },
  })

  const handleOnCreate = (startTimeHour: number, endTimeHour: number) => {
    const createScheduleData = schemas.controller_ScheduleCreateRequestData.parse({
      start_time: startTimeHour,
      end_time: endTimeHour,
    })

    showLoading('schedule_create', 'createing...', `スケジュールを作成中`)
    postScheduleCampus(createScheduleData)
      .then(success => {
        showSuccess('', `スケジュールの作成が完了しました`)

        const scheduleId = success.schedule_id
        router.push(ROUTES.TIME_SCHEDULE(scheduleId))
      })
      .catch(error => {
        showApiError(error)
      })
      .finally(() => {
        dismissLoading('schedule_create')
      })
  }

  const onHandleDelete = (scheduleId: number) => {
    apiClient
      .deleteScheduleSchedule_id(undefined, {
        params: { schedule_id: String(scheduleId) },
      })
      .then(() => {
        showSuccess('', `スケジュールを削除しました`)
        refetch()
      })
      .catch(err => {
        showError('', err.response?.data.msg)
      })
  }

  const onHandleDuplicate = (scheduleId: number) => {
    showLoading('duplicate', 'duplicating...', `スケジュールを複製中...`)
    apiClient
      .postScheduleSchedule_idduplicate(undefined, {
        params: { schedule_id: String(scheduleId) },
      })
      .then(() => {
        showSuccess('', `スケジュールを複製しました`)
        refetch()
      })
      .catch(err => {
        console.log('err', err)
        showError('', err.response?.data.msg)
      })
      .finally(() => {
        dismissLoading('duplicate')
      })
  }

  return (
    <div className='h-full flex flex-col'>
      <ScheduleListHeader selectCampusName={campus} />
      {(isLoading || isCampusLoading) && <Loading />}
      {schedules && (
        <ScheduleListTemplate
          campusName={campusName}
          onCreate={handleOnCreate}
          schedules={schedules}
          onHandleDuplicate={onHandleDuplicate}
          onHandleDelete={onHandleDelete}
          scheduleAddOpened={scheduleAddOpened}
          scheduleAddOpen={scheduleAddOpen}
          scheduleAddClose={scheduleAddClose}
        />
      )}
    </div>
  )
}

export default ScheduleList
