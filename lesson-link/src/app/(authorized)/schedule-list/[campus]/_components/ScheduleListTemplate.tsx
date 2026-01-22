'use client'

import { EDITOR, OWNER, ROUTES } from '@constants/Constants'
import { Button, Modal, Table } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import { formatDate } from '@/app/lib/util'
import { useUser } from '@/context/UserContext'
import { schemas } from '@/generated/api'
import { ActionModalContent, Tag } from './ActionModalContent'
import { ScheduleCreateTemplate } from './ScheduleCreateTemplate'

type Props = {
  campusName: string
  onCreate: (startTimeHour: number, endTimeHour: number) => void
  schedules: Zod.infer<typeof schemas.presenter_ScheduleListResponse>
  onHandleDuplicate: (scheduleId: number) => void
  onHandleDelete: (scheduleId: number) => void
  scheduleAddOpened: boolean
  scheduleAddOpen: () => void
  scheduleAddClose: () => void
}

export const ScheduleListTemplate = ({
  campusName,
  onCreate,
  schedules,
  onHandleDuplicate,
  onHandleDelete,
  scheduleAddOpened,
  scheduleAddOpen,
  scheduleAddClose,
}: Props) => {
  const { user } = useUser()

  if (!user) return

  const isOwner = user.roleKey === OWNER
  const isEditor = user.roleKey === EDITOR

  const router = useRouter()
  const onClickTimeSchedule = (scheduleId: number) => {
    router.push(ROUTES.TIME_SCHEDULE(scheduleId))
  }

  const [actionOpened, { open: actionOpen, close: actionClose }] = useDisclosure(false)
  const deleteRef = useRef({
    title: '',
    tag: '',
    scheduleId: 0,
  })
  const onClickAction = (tag: Tag, title: string, scheduleId: number) => {
    deleteRef.current.title = title
    deleteRef.current.tag = tag
    deleteRef.current.scheduleId = scheduleId
    actionOpen()
  }

  const onAction = (tag: Tag) => {
    if (tag === 'duplicate') {
      onHandleDuplicate(deleteRef.current.scheduleId)
    }

    if (tag === 'delete') {
      onHandleDelete(deleteRef.current.scheduleId)
    }
  }

  const rows = schedules.schedules.map(schedule => {
    return (
      <Table.Tr
        key={schedule.schedule_id}
        className='hover:bg-[#ebf4ef] cursor-pointer'
        onClick={() => onClickTimeSchedule(schedule.schedule_id)}
      >
        <Table.Td className='min-w-[170px]'>{schedule.title}</Table.Td>
        <Table.Td className='min-w-[170px]'>{schedule.created_user_name}</Table.Td>
        <Table.Td className='min-w-[170px]'>{schedule.last_update_user_name}</Table.Td>
        <Table.Td className='min-w-[170px]'>{formatDate(schedule.last_update_date_time)}</Table.Td>
        <Table.Td className='min-w-[170px]'>
          <Button
            variant='outline'
            color='#20BEFF'
            radius='md'
            className='bg-[#F9F9F9]'
            onClick={e => {
              e.stopPropagation()
              onClickAction('duplicate', schedule.title, schedule.schedule_id)
            }}
            disabled={!isOwner && !isEditor}
          >
            複製
          </Button>
          <Button
            variant='outline'
            color='#FF7777'
            radius='md'
            className='bg-[#F9F9F9] ml-3'
            onClick={e => {
              e.stopPropagation()
              onClickAction('delete', schedule.title, schedule.schedule_id)
            }}
            disabled={!isOwner && !(isEditor && schedule.created_user_id === user.id)}
          >
            削除
          </Button>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <div className='flex flex-col mt-16 mb-5 ml-28 mr-28 flex-grow overflow-hidden'>
      <div className='flex justify-between items-center'>
        <div className="text-[#222222] text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
          {campusName}:スケジュール一覧
        </div>
        <Button
          fullWidth
          className={`w-[322px] h-[60px] ${isOwner || isEditor ? 'bg-themeColor hover:bg-hoverThemeColor' : ''} rounded`}
          onClick={scheduleAddOpen}
          disabled={!isOwner && !isEditor}
        >
          <div className="text-center text-white text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
            ＋ 新規スケジュール作成
          </div>
        </Button>
      </div>
      <div className='mt-14 overflow-auto custom-scrollbar flex-grow'>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '50%' }}>タイトル</Table.Th>
              <Table.Th style={{ width: '10%' }}>作成者</Table.Th>
              <Table.Th style={{ width: '10%' }}>最終更新者</Table.Th>
              <Table.Th style={{ width: '10%' }}>更新日時</Table.Th>
              <Table.Th style={{ width: '10%' }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
      <Modal opened={scheduleAddOpened} onClose={scheduleAddClose} centered size={'35%'}>
        <ScheduleCreateTemplate
          buttonName='スケジュール作成'
          onCreate={onCreate}
          showStartTimeSelects={true}
        />
      </Modal>
      <Modal opened={actionOpened} onClose={actionClose} centered withCloseButton={false}>
        <ActionModalContent
          title={deleteRef.current.title}
          tag={deleteRef.current.tag as Tag}
          onAction={onAction}
          onClose={actionClose}
        />
      </Modal>
    </div>
  )
}
