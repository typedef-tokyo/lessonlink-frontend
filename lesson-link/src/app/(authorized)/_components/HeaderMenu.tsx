'use client'
import { HEADER_MENU_NAME_MAP, OWNER, ROUTES } from '@constants/Constants'
import { Menu } from '@mantine/core'
import { IconChevronRight, IconMenu2 } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'
import { apiClient } from '@/app/lib/zodios'
import { useUser } from '@/context/UserContext'

export const HeaderMenu = () => {
  const { user } = useUser()

  if (!user) return

  const isOwner = user.roleKey === OWNER
  const name = user.name
  const userName = user.userName

  const logout = () => {
    apiClient
      .postUserlogout(undefined)
      .then(() => {
        window.location.href = ROUTES.LOGIN
      })
      .catch(err => {
        window.location.href = ROUTES.LOGIN
      })
  }

  return (
    <Menu shadow='md' width={'10%'}>
      <Menu.Target>
        <div className='w-[1.6vw] cursor-pointer min-w-[30px]'>
          <IconMenu2 size={24} color='white' className='w-full h-full' />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <div className='pl-4 pt-2 pr-2 pb-2'>
          <div className="text-[#222222] text-sm font-light font-['Hiragino Kaku Gothic Pro'] leading-snug tracking-wide">
            {name}
          </div>
          <div className="text-[#d3d3d3] text-[13px] pt-1 font-light font-['Hiragino Kaku Gothic Pro'] leading-none tracking-wide">
            {userName}
          </div>
        </div>
        <Menu.Divider />
        <Menu.Item className='p-0' rightSection={<IconChevronRight size={14} />}>
          <Link href={ROUTES.LESSON_EDIT}>
            <div className='pl-4 pt-2 pr-1 pb-2'>
              <div className=''>{HEADER_MENU_NAME_MAP['lesson_edit']}</div>
            </div>
          </Link>
        </Menu.Item>
        {isOwner && (
          <>
            <Menu.Divider />
            <Menu.Item className='p-0' rightSection={<IconChevronRight size={14} />}>
              <Link href={ROUTES.ROOM_EDIT}>
                <div className='pl-4 pt-2 pr-1 pb-2'>
                  <div className=''>{HEADER_MENU_NAME_MAP['room_edit']}</div>
                </div>
              </Link>
            </Menu.Item>
          </>
        )}
        <Menu.Divider />
        <Menu.Item className='p-0' rightSection={<IconChevronRight size={14} />}>
          <Link href={ROUTES.USER_LIST}>
            <div className='pl-4 pt-2 pr-1 pb-2'>
              <div className=''>{HEADER_MENU_NAME_MAP['user_management']}</div>
            </div>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className='p-0' rightSection={<IconChevronRight size={14} />}>
          <Link href={ROUTES.CAMPUS_SELECT}>
            <div className='pl-4 pt-2 pr-1 pb-2'>
              <div className=''>{HEADER_MENU_NAME_MAP['select_campus']}</div>
            </div>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          className='p-0'
          rightSection={<IconChevronRight size={14} />}
          onClick={() => logout()}
        >
          <div className='pl-4 pt-2 pr-1 pb-2'>
            <div className=''>{HEADER_MENU_NAME_MAP['log_out']}</div>
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
