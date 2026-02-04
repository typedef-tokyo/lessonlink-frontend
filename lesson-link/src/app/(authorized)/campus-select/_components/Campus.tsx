'use client'

import { ROUTES } from '@constants/Constants'
import Link from 'next/link'
import React from 'react'
import { schemas } from '@/generated/api'

type Props = {
  campus: Zod.infer<typeof schemas.presenter_CampusListDTO>
}

export const Campus = ({ campus }: Props) => {
  return (
    <Link href={ROUTES.SCHEDULE_LIST(campus.campus)}>
      <div className='mt-2 aspect-[16/9] cursor-pointer'>
        <img
          src={`/images/campus/${campus.campus}.jpg`}
          alt={`${campus?.campus_name}`}
          className='w-full h-full'
        />
        <div className='text-[#222222] font-semibold mt-3'>{campus?.campus_name}</div>
      </div>
    </Link>
  )
}
