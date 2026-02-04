'use client'

import React from 'react'
import { schemas } from '@/generated/api'
import { Campus } from './Campus'

type Props = {
  campuses: Zod.infer<typeof schemas.presenter_CampusListResponse>
}

export const CampusSelectTemplate = ({ campuses }: Props) => {
  return (
    <>
      <div className='pl-28 pr-28 mt-14'>
        <div className="text-[#1e2123] text-lg font-semibold font-['Hiragino Kaku Gothic Pro'] leading-7 tracking-wide">
          キャンパスを選択
        </div>
        <hr className='mt-2 border-[#D3D3D3]' />
        <div className='grid grid-cols-4 gap-5 mt-10 auto-rows-fr'>
          {campuses.campuses.map((campus, index) => (
            <Campus key={index} campus={campus} />
          ))}
        </div>
      </div>
    </>
  )
}
