'use client'
import { ROUTES } from '@constants/Constants'
import { Select } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { schemas } from '@/generated/api'

type Props = {
  selectCampus: string
  campuses: Zod.infer<typeof schemas.presenter_CampusListResponse>
}

export const CampusMenu = ({ selectCampus, campuses }: Props) => {
  const router = useRouter()
  const campusOptions = campuses.campuses.map(campus => ({
    value: campus.campus,
    label: campus.campus_name,
  }))

  if (!campusOptions.length) return null

  return (
    <div className='mr-10' style={{ width: 'fit-content' }}>
      <Select
        data={campusOptions}
        value={selectCampus}
        onChange={value => {
          if (value) router.push(ROUTES.SCHEDULE_LIST(value))
        }}
        classNames={{
          input:
            "text-[#027530] text-xs font-light font-['Hiragino Kaku Gothic Pro'] leading-[18.60px] tracking-wide",
        }}
        rightSection={<IconChevronDown size={16} />}
        placeholder='キャンパスを選択'
      />
    </div>
  )
}
