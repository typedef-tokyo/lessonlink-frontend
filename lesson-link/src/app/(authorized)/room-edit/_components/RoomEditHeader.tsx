'use client'
import { CAMPUSES } from '@constants/Constants'
import React from 'react'
import { HeaderMenu } from '@/app/(authorized)/_components/HeaderMenu'
import { schemas } from '@/generated/api'
import { CampusMenu } from '../../_components/CampusMenu'

type Props = {
  selectCampusName: string
  setCampus: (campus: CAMPUSES) => void
  campuses: Zod.infer<typeof schemas.presenter_CampusListResponse>
}

export const RoomEditHeader = ({ selectCampusName, setCampus, campuses }: Props) => {
  return (
    <header className='bg-themeColor h-[9vh] min-h-[73px] justify-between pt-5 pb-5 px-9 flex items-center flex-shrink-0'>
      <div className='w-40'>
        <img src='/images/lessonlink.png' alt='' />
      </div>
      <div className='flex items-center justify-end'>
        <CampusMenu selectCampus={selectCampusName} campuses={campuses} setCampus={setCampus} />
        <HeaderMenu />
      </div>
    </header>
  )
}
