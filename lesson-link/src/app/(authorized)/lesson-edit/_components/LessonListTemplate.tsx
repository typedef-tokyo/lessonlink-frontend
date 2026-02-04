'use client'

import { EDITOR, OWNER } from '@constants/Constants'
import { Button, Modal, Table } from '@mantine/core'
import React, { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { schemas } from '@/generated/api'
import { LessonAddModalContent } from './LessonAddModalContent'
import { LessonEditModalContent } from './LessonEditModalContent'

type Props = {
  campusName: string
  lessonList: Zod.infer<typeof schemas.presenter_LessonListResponse>
  onEditAddSubmit: (values: Zod.infer<typeof schemas.controller_LessonAddRequestData>) => void
  onEditUpdateSubmit: (
    lessonid: number,
    values: Zod.infer<typeof schemas.controller_LessonEditRequestData>,
  ) => void
  masterAddmodal: {
    opened: boolean
    open: () => void
    close: () => void
  }
  masterEditmodal: {
    opened: boolean
    open: () => void
    close: () => void
  }
}

export const LessonListTemplate = ({
  campusName,
  lessonList,
  onEditAddSubmit,
  onEditUpdateSubmit,
  masterAddmodal,
  masterEditmodal,
}: Props) => {
  const [editMasterCode, setEditMasterCode] = useState<{
    lessonid: number
    name: string
    value: number
  }>({ lessonid: 0, name: '', value: 0 })

  const { user } = useUser()
  if (!user) return

  const isOwner = user.roleKey === OWNER
  const isEditor = user.roleKey === EDITOR
  const enableEdit = isOwner || isEditor

  const onClickEdit = (lessonID: number, name: string, value: number) => {
    masterEditmodal.open()
    setEditMasterCode({ lessonid: lessonID, name: name, value: value })
  }

  if (lessonList?.lessons) {
    lessonList.lessons.sort((a, b) => {
      return a.id - b.id
    })
  }

  const rows = lessonList.lessons.map(lesson => (
    <Table.Tr key={Math.random()}>
      <Table.Td className='min-w-[170px]'>{lesson.lesson_name}</Table.Td>
      <Table.Td className='min-w-[170px]'>{lesson.lesson_duration}</Table.Td>
      <Table.Td className='min-w-[170px]'>
        <Button
          variant='outline'
          color='#20BEFF'
          radius='md'
          className='bg-[#F9F9F9]'
          onClick={() => onClickEdit(lesson.id, lesson.lesson_name, lesson.lesson_duration)}
        >
          編集
        </Button>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <div className='flex flex-col mt-5 flex-grow overflow-hidden'>
      <Modal
        opened={masterAddmodal.opened}
        onClose={masterAddmodal.close}
        title='新規講座追加'
        centered
      >
        <LessonAddModalContent onClose={masterAddmodal.close} onSubmit={onEditAddSubmit} />
      </Modal>
      <Modal opened={masterEditmodal.opened} onClose={masterEditmodal.close} centered>
        <LessonEditModalContent
          lessonID={editMasterCode.lessonid}
          name={editMasterCode.name}
          value={editMasterCode.value}
          onClose={masterEditmodal.close}
          onSubmit={onEditUpdateSubmit}
        />
      </Modal>
      <div className='flex justify-between items-center'>
        <div className="text-[#222222] text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
          {campusName}:講座設定
        </div>
        <Button
          fullWidth
          className={`w-[322px] h-[60px] ${enableEdit ? 'bg-themeColor hover:bg-hoverThemeColor' : ''} rounded`}
          onClick={masterAddmodal.open}
          disabled={!enableEdit}
        >
          <div className="text-center text-white text-[21px] font-semibold font-['Hiragino Kaku Gothic Pro'] leading-loose tracking-wide">
            ＋ 新規講座追加
          </div>
        </Button>
      </div>
      <div className='mt-6 overflow-auto custom-scrollbar flex-grow'>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '60%' }}>講座名</Table.Th>
              <Table.Th style={{ width: '20%' }}>講座時間(分)</Table.Th>
              <Table.Th style={{ width: '20%' }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </div>
  )
}
