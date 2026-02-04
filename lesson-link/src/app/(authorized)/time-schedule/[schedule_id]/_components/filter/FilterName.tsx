'use client'

import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { SortItemListByDurationTime, SortLessonListByName, ToHiragana } from '../sort/SortMenu'

export const SetFilterName = <T extends { item_id: number; name: string; duration: number }>(
  list: T[],
  name: string,
  setFilterKeyword: (name: string) => void,
  sortField: 'name' | 'time',
  sortOrder: 'asc' | 'desc',
  setGroup: React.Dispatch<React.SetStateAction<Map<number, T[]>>>,
) => {
  setFilterKeyword(name)

  const normalizedKeyword = ToHiragana(name.trim())

  const filtered =
    normalizedKeyword === ''
      ? list
      : list.filter(item => {
          const normalized = ToHiragana(item.name)
          return normalized.includes(normalizedKeyword)
        })

  const grouped =
    sortField === 'name'
      ? (SortLessonListByName(filtered, sortOrder) as Map<number, T[]>)
      : SortItemListByDurationTime(filtered, sortOrder)

  setGroup(grouped)
}

type Props = {
  name: string
  filter: (input: string) => void
}

export const FilterName = ({ name, filter }: Props) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    filter(value)
  }, [value])

  const icon = <IconSearch />
  return (
    <TextInput
      leftSectionPointerEvents='none'
      leftSection={icon}
      placeholder={`${name}を検索`}
      radius='lg'
      onChange={event => {
        const newValue = event.currentTarget.value
        setValue(newValue)
      }}
    />
  )
}
