'use client'

import { closestCenter, DndContext } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Table, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCircleMinus, IconCirclePlusFilled, IconGripVertical } from '@tabler/icons-react'
import React from 'react'
import { RoomEditFormValue } from './RoomEditTemplate'

type Props = {
  form: ReturnType<typeof useForm<RoomEditFormValue>>
}

type RoomType = {
  id?: number
  room_index: number
  room_name: string
}

type SortableRowProps = {
  room: RoomType
  i: number
  children: React.ReactNode
}

const SortableRow = ({ room, i, children }: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: (room.id ?? room.room_index).toString(),
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td style={{ width: 32, cursor: 'grab' }}>
        <span {...listeners}>
          <IconGripVertical className='text-gray-600 group-hover:text-blue-500' />
        </span>
      </td>
      {children}
    </tr>
  )
}

export const RoomEditTable = ({ form }: Props) => {
  React.useEffect(() => {
    const newList = form.values.room_list.map((room, idx) =>
      room.id ? room : { ...room, id: Date.now() + idx },
    )
    if (JSON.stringify(form.values.room_list) !== JSON.stringify(newList)) {
      form.setValues({
        ...form.values,
        room_list: newList,
      })
    }
  }, [form.values.room_list])

  const handleAddRow = () => {
    const currentList = form.values.room_list
    const newItem = {
      id: Date.now(),
      room_index: currentList.length + 1,
      room_name: '',
      is_new: true,
    }
    form.setValues({
      ...form.values,
      room_list: [...currentList, newItem],
    })
  }

  const handleRemoveRow = (index: number) => {
    form.setValues({
      ...form.values,
      room_list: form.values.room_list.filter((_, i) => i !== index),
    })
  }

  const plusIcon = (
    <IconCirclePlusFilled className='text-themeColor group-hover:text-hoverThemeColor' size={30} />
  )

  const minusIcon = <IconCircleMinus className='text-red-700 group-hover:text-red-600' />

  const roomIds = form.values.room_list.map(room => (room.id ?? room.room_index).toString())

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = roomIds.indexOf(active.id)
      const newIndex = roomIds.indexOf(over.id)
      const newList = arrayMove(form.values.room_list, oldIndex, newIndex)
      // room_indexを再採番
      newList.forEach((room, idx) => {
        room.room_index = idx + 1
      })
      form.setValues({
        ...form.values,
        room_list: newList,
      })
    }
  }

  return (
    <div className='overflow-auto custom-scrollbar flex-grow'>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className='w-[32px]' />
              <Table.Th className='w-[20%]'>番号</Table.Th>
              <Table.Th className='w-[80%]'>名前</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <SortableContext items={roomIds} strategy={verticalListSortingStrategy}>
            <Table.Tbody>
              {form.values.room_list.map((room, i) => (
                <SortableRow key={String(room.id ?? room.room_index)} room={room} i={i}>
                  <Table.Td>
                    {room.is_new ? (
                      <div
                        className='flex justify-center cursor-pointer group'
                        onClick={() => handleRemoveRow(i)}
                      >
                        {minusIcon}
                      </div>
                    ) : (
                      i + 1
                    )}
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      withAsterisk
                      autoComplete='off'
                      {...form.getInputProps(`room_list.${i}.room_name`)}
                    />
                  </Table.Td>
                </SortableRow>
              ))}
            </Table.Tbody>
          </SortableContext>
        </Table>
      </DndContext>
      <div
        className='flex w-full justify-center mt-1 cursor-pointer group mb-16'
        onClick={() => handleAddRow()}
      >
        {plusIcon}
      </div>
    </div>
  )
}
