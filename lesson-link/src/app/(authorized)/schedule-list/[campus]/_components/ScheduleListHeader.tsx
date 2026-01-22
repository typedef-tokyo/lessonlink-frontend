'use client'
import React, { useEffect } from 'react'
import { HeaderMenu } from '@/app/(authorized)/_components/HeaderMenu'
import { showApiError } from '@/app/lib/notification'
import { apiHooks } from '@/app/lib/zodios'
import { CampusMenu } from './CampusMenu'

type Props = {
  selectCampusName: string
}

const ScheduleListHeader = ({ selectCampusName }: Props) => {
  const { data: campuses, error, isLoading } = apiHooks.useGetCampuslist()

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  return (
    !isLoading &&
    !error &&
    campuses && (
      <header className='bg-themeColor h-[9vh] min-h-[73px] justify-between pt-5 pb-5 px-9 flex items-center flex-shrink-0'>
        <div className='w-40'>
          <img src='/images/lessonlink.png' alt='' />
        </div>
        <div className='flex items-center justify-end'>
          <CampusMenu selectCampus={selectCampusName} campuses={campuses} />
          <HeaderMenu />
        </div>
      </header>
    )
  )
}

export default ScheduleListHeader
