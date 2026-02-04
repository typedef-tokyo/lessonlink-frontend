'use client'
import React, { useEffect } from 'react'
import Loading from '@/app/_components/indicator/Loading'
import Header from '@/app/(authorized)/_components/Header'
import { showApiError } from '@/app/lib/notification'
import { apiHooks } from '@/app/lib/zodios'
import { CampusSelectTemplate } from './_components/CampusSelectTemplate'

const CampusSelectPage = () => {
  const { data: campuses, error, isLoading } = apiHooks.useGetCampuslist()

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  return (
    <div className='h-full flex flex-col'>
      <Header />
      {isLoading && <Loading />}
      {campuses && <CampusSelectTemplate campuses={campuses} />}
    </div>
  )
}

export default CampusSelectPage
