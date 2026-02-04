'use client'

import { Menu } from '@mantine/core'
import { IconSortDescending2Filled } from '@tabler/icons-react'
import React from 'react'

export const SortItemListByDurationTime = <
  T extends { item_id: number; duration: number; name: string },
>(
  list: T[],
  order: 'asc' | 'desc',
): Map<number, T[]> => {
  const grouped = list.reduce<Map<number, T[]>>((map, item) => {
    if (!map.has(item.item_id)) {
      map.set(item.item_id, [])
    }
    map.get(item.item_id)!.push(item)
    return map
  }, new Map())

  const sorted = Array.from(grouped).sort((a, b) => {
    const sumA = a[1].reduce((sum, item) => sum + item.duration, 0)
    const sumB = b[1].reduce((sum, item) => sum + item.duration, 0)
    if (sumA === sumB) {
      const nameA = ToHiragana(`${a[1][0].name}`)
      const nameB = ToHiragana(`${b[1][0].name}`)
      return nameA.localeCompare(nameB, 'ja')
    }
    return order === 'asc' ? sumA - sumB : sumB - sumA
  })

  return new Map(sorted)
}

export const ToHiragana = (str: string): string => {
  const fullWidth = str.normalize('NFKC')
  return fullWidth.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
}

export const SortLessonListByName = <T extends { item_id: number; name: string }>(
  list: T[],
  order: 'asc' | 'desc',
): Map<number, T[]> => {
  const grouped = list.reduce<Map<number, T[]>>((map, item) => {
    if (!map.has(item.item_id)) {
      map.set(item.item_id, [])
    }
    map.get(item.item_id)!.push(item)
    return map
  }, new Map())

  const sorted = Array.from(grouped).sort((a, b) => {
    const nameA = ToHiragana(`${a[1][0].name}`)
    const nameB = ToHiragana(`${b[1][0].name}`)
    return order === 'asc' ? nameA.localeCompare(nameB, 'ja') : nameB.localeCompare(nameA, 'ja')
  })

  return new Map(sorted)
}

type Props = {
  sort: (field: 'name' | 'time', order: 'asc' | 'desc') => void
}

export const SortMenu = ({ sort }: Props) => {
  //////

  const onClickSort = (field: 'name' | 'time', order: 'asc' | 'desc') => {
    sort(field, order)
  }

  return (
    <Menu shadow='md'>
      <Menu.Target>
        <div className='items-center ml-1 cursor-pointer'>
          <IconSortDescending2Filled />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item className='p-0'>
          <div className='pl-1 pt-1 pr-1 pb-1'>
            <div className='text-[#7a7a7a]' onClick={() => onClickSort('name', 'asc')}>
              名前／昇順
            </div>
          </div>
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item className='p-0'>
          <div className='pl-1 pt-1 pr-1 pb-1'>
            <div className='text-[#7a7a7a]' onClick={() => onClickSort('name', 'desc')}>
              名前／降順
            </div>
          </div>
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item className='p-0'>
          <div className='pl-1 pt-1 pr-1 pb-1'>
            <div className='text-[#7a7a7a]' onClick={() => onClickSort('time', 'asc')}>
              時間／昇順
            </div>
          </div>
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item className='p-0'>
          <div className='pl-1 pt-1 pr-1 pb-1'>
            <div className='text-[#7a7a7a]' onClick={() => onClickSort('time', 'desc')}>
              時間／降順
            </div>
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
