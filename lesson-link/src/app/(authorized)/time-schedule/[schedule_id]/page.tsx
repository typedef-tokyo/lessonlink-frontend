'use client'
import { EDITOR, OWNER, ROUTES, VIEWER } from '@constants/Constants'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Loading from '@/app/_components/indicator/Loading'
import { showApiError, showSuccess } from '@/app/lib/notification'
import { apiClient, apiHooks } from '@/app/lib/zodios'
import { useUser } from '@/context/UserContext'
import { schemas } from '@/generated/api'
import { RoomItem } from '../types'
import { RoomTemplate } from './_components/InvisibleRoomSetting/RoomTemplate'
import { ScheduleTimeTemplate } from './_components/ScheduleTime/ScheduleTimeTemplate'
import TimeScheduleHeader, { TitleValues } from './_components/TimeScheduleHeader'
import {
  ItemDivideValues,
  ItemJoinValues,
  ItemMoveValues,
  ItemReturnListValues,
  ItemShiftValues,
  schedule,
  TimeScheduleTemplate,
} from './_components/TimeScheduleTemplate'

type ScheduleItemMoveResponse = Zod.infer<typeof schemas.presenter_ScheduleItemEditResponse>

type Props = {
  params: {
    schedule_id: string
  }
}

const TimeSchedule = ({ params }: Props) => {
  const { user } = useUser()

  const scheduleId = Number(params.schedule_id)

  const { mutateAsync: patchScheduleSave } = apiHooks.usePostScheduleSchedule_id({
    params: { schedule_id: scheduleId },
  })

  const { mutateAsync: patchScheduleTitle } = apiHooks.usePatchScheduleSchedule_idtitle({
    params: { schedule_id: scheduleId },
  })

  const { mutateAsync: patchScheduleItemMove } = apiHooks.usePostScheduleSchedule_iditemMove({
    params: { schedule_id: scheduleId },
  })

  const { mutateAsync: patchScheduleItemReturnList } =
    apiHooks.usePostScheduleSchedule_iditemReturnList({
      params: { schedule_id: scheduleId },
    })

  const { mutateAsync: patchScheduleItemDivide } = apiHooks.usePostScheduleSchedule_iditemDivide({
    params: { schedule_id: scheduleId },
  })

  const { mutateAsync: patchScheduleItemJoin } = apiHooks.usePostScheduleSchedule_iditemJoin({
    params: { schedule_id: scheduleId },
  })

  const { mutateAsync: patchScheduleItemShift } = apiHooks.usePostScheduleSchedule_iditemShift({
    params: { schedule_id: scheduleId },
  })

  const { mutateAsync: putInvisibleRoom } = apiHooks.usePutScheduleSchedule_idroominvisible({
    params: { schedule_id: scheduleId },
  })

  const { mutateAsync: patchScheduleTimeEdit } = apiHooks.usePatchScheduleSchedule_idtime({
    params: { schedule_id: scheduleId },
  })

  const [schedule, setSchedule] = useState<schedule>()
  const [roomItemList, setRoomItemList] = useState<Array<RoomItem>>([])

  const { data, error, isLoading, refetch } = apiHooks.useGetScheduleSchedule_id(
    {
      params: { schedule_id: scheduleId },
    },
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  )

  const [selectHistoryIndex, setSelectHistoryIndex] = useState(-1)
  const showingHistoryIndex = useRef(-1)

  useEffect(() => {
    if (selectHistoryIndex < 1) {
      return
    }

    if (showingHistoryIndex.current === selectHistoryIndex) return
    showingHistoryIndex.current = selectHistoryIndex

    apiClient
      .getScheduleSchedule_id({
        params: { schedule_id: scheduleId },
        queries: { history: selectHistoryIndex },
      })
      .then(res => {
        showingHistoryIndex.current = res.history_index
        setSchedule(res)
      })
      .catch(err => {
        showApiError(err)
      })
  }, [selectHistoryIndex])

  useEffect(() => {
    if (error) {
      showApiError(error)
    }
  }, [error])

  const [title, setTitle] = useState('')
  const [isDisableClick, setIsDisableClick] = useState(true)
  const [historyIndex, setHistoryIndex] = useState(-1)

  const countUpHistory = () => {
    setSelectHistoryIndex(prev => prev + 1)
  }

  const countDownHistory = () => {
    setSelectHistoryIndex(prev => prev - 1)
  }

  const initialScheduleStartTime = useRef(-1)

  useEffect(() => {
    if (data && !error && !isLoading) {
      setTitle(data.title)

      showingHistoryIndex.current = data.history_index
      setSchedule(data)
      setHistoryIndex(data.history_index)
      setSelectHistoryIndex(data.history_index)

      initialScheduleStartTime.current = data.schedule_start_time

      setStartTime(data.schedule_start_time)
      setEndTime(data.schedule_end_time)

      if (!user) {
        setIsDisableClick(true)
        return
      }

      const isOwner = user.roleKey === OWNER
      if (isOwner) {
        setIsDisableClick(false)
        return
      }
      const isEditor = user.roleKey === EDITOR
      const isViewer = user.roleKey === VIEWER
      setIsDisableClick(!isOwner && (isViewer || !(isEditor && user.id === data.created_user_id)))
    }
  }, [data])

  useEffect(() => {
    setSelectHistoryIndex(historyIndex)
  }, [historyIndex])

  const handleOnSave = () => {
    let setIndexHistory = showingHistoryIndex.current

    if (setIndexHistory <= 0) {
      setIndexHistory = 1
    }

    const isStartTimeUpdate = initialScheduleStartTime.current !== startTime

    if (isStartTimeUpdate) {
      setIndexHistory = 1
    }

    const values = {
      history_index: setIndexHistory,
    }

    const updateEditingData = schemas.controller_ScheduleSaveRequestData.parse(values)
    patchScheduleSave(updateEditingData)
      .then(res => {
        const resHistoryIndex = res.history_index
        showingHistoryIndex.current = resHistoryIndex
        setHistoryIndex(resHistoryIndex)
        setSelectHistoryIndex(resHistoryIndex)

        showSuccess('', res.msg)
        if (isStartTimeUpdate) {
          initialScheduleStartTime.current = startTime
        }
      })
      .catch(error => {
        showApiError(error)
      })
      .finally(() => {})
  }

  const handleOnTitleWipUpdate = (values: TitleValues) => {
    const updateEditingData = schemas.controller_ScheduleSaveTitleRequestData.parse(values)
    patchScheduleTitle(updateEditingData)
      .then(res => {
        showSuccess('', res.msg)
      })
      .catch(error => {
        showApiError(error)
        errRefresh()
      })
      .finally(() => {})
  }

  const errRefresh = () => {
    showSuccess('', 'エラーが発生したためデータを最新に同期しました')
    refetch()
  }

  const editItemResponseSetter = (res: ScheduleItemMoveResponse) => {
    showingHistoryIndex.current = res.history_index
    setHistoryIndex(res.history_index)
    setSelectHistoryIndex(res.history_index)

    setSchedule(prev =>
      prev
        ? {
            ...prev,
            lesson_item_list: res.lesson_item_list,
            room_lesson_list: res.room_lesson_list,
          }
        : prev,
    )
  }

  const handleOnItemMove = (values: ItemMoveValues) => {
    let setIndexHistory = selectHistoryIndex

    if (setIndexHistory <= 0) {
      setIndexHistory = 1
    }

    values.history_index = setIndexHistory
    const itemMoveData = schemas.controller_ScheduleItemMoveRequestData.parse(values)
    patchScheduleItemMove(itemMoveData)
      .then(res => {
        editItemResponseSetter(res)
      })
      .catch(error => {
        showApiError(error)
        errRefresh()
      })
      .finally(() => {})
  }

  const handleOnItemReturnList = (values: ItemReturnListValues) => {
    let setIndexHistory = selectHistoryIndex

    if (setIndexHistory <= 0) {
      setIndexHistory = 1
    }

    values.history_index = setIndexHistory
    const itemReturnListData = schemas.controller_ScheduleItemReturnListRequestData.parse(values)
    patchScheduleItemReturnList(itemReturnListData)
      .then(res => {
        editItemResponseSetter(res)
      })
      .catch(error => {
        showApiError(error)
        errRefresh()
      })
      .finally(() => {})
  }

  const handleOnItemDeivde = (values: ItemDivideValues) => {
    let setIndexHistory = selectHistoryIndex

    if (setIndexHistory <= 0) {
      setIndexHistory = 1
    }

    values.history_index = setIndexHistory
    const itemDivideData = schemas.controller_ScheduleItemDivideRequestData.parse(values)
    patchScheduleItemDivide(itemDivideData)
      .then(res => {
        editItemResponseSetter(res)
      })
      .catch(error => {
        showApiError(error)
        errRefresh()
      })
      .finally(() => {})
  }

  const router = useRouter()
  const onBack = () => {
    if (data) {
      router.push(ROUTES.SCHEDULE_LIST(data.campus))
    }
  }

  const handleOnItemJoin = (values: ItemJoinValues) => {
    let setIndexHistory = selectHistoryIndex

    if (setIndexHistory <= 0) {
      setIndexHistory = 1
    }

    values.history_index = setIndexHistory
    const itemJoinData = schemas.controller_ScheduleItemJoinRequestData.parse(values)
    patchScheduleItemJoin(itemJoinData)
      .then(res => {
        editItemResponseSetter(res)
      })
      .catch(error => {
        showApiError(error)
        errRefresh()
      })
      .finally(() => {})
  }

  const handleOnItemShift = (values: ItemShiftValues) => {
    let setIndexHistory = selectHistoryIndex

    if (setIndexHistory <= 0) {
      setIndexHistory = 1
    }

    values.history_index = setIndexHistory
    const itemShiftData = schemas.controller_ScheduleItemShiftRequestData.parse(values)
    patchScheduleItemShift(itemShiftData)
      .then(res => {
        editItemResponseSetter(res)
      })
      .catch(error => {
        showApiError(error)
        errRefresh()
      })
      .finally(() => {})
  }

  const handleOnScheduleTimeEdit = (startTime: number, endTime: number) => {
    const requestData = schemas.controller_ScheduleTimeEditRequestData.parse({
      start_time: startTime,
      end_time: endTime,
    })
    patchScheduleTimeEdit(requestData)
      .then(_ => {
        refetch()
      })
      .catch(error => {
        showApiError(error)
        errRefresh()
      })
      .finally(() => {})
  }

  const openPrint = () => {
    window.open(ROUTES.PRINT(Number(scheduleId)), '_blank')
  }

  const [invisibleRoomOpened, { open: invisibleRoomOpen, close: invisibleRoomClose }] =
    useDisclosure(false)

  /////////
  const handleOnInvisibleRoomSave = (list: number[]) => {
    const updateInvisibleRoomData = schemas.controller_InvisibleRoomSaveRequestData.parse({
      invisible_rooms: list,
    })

    putInvisibleRoom(updateInvisibleRoomData)
      .then(_ => {
        showSuccess('', '保存しました')
        refetch()
      })
      .catch(error => {
        showApiError(error)
      })
  }

  const [startTime, setStartTime] = useState<number>(-1)
  const [endTime, setEndTime] = useState<number>(-1)
  const [scheduleTimeOpened, { open: scheduleTimeOpen, close: scheduleTimeClose }] =
    useDisclosure(false)

  return (
    <div className='h-full flex flex-col select-none'>
      {isLoading && <Loading />}
      {schedule && (
        <>
          <TimeScheduleHeader
            title={title}
            setTitle={setTitle}
            historyIndex={historyIndex}
            selectHistoryIndex={selectHistoryIndex}
            countUpHistory={countUpHistory}
            countDownHistory={countDownHistory}
            onSave={() => handleOnSave()}
            onBack={onBack}
            isDisableClick={isDisableClick}
            openPrint={openPrint}
            sxheduleTimeOpen={scheduleTimeOpen}
            handleOnTitleWipUpdate={handleOnTitleWipUpdate}
          />
          <TimeScheduleTemplate
            schedule={schedule}
            roomItemList={roomItemList}
            setRoomItemList={setRoomItemList}
            isDisableClick={isDisableClick}
            invisibleRoomOpen={invisibleRoomOpen}
            scheduleStartTime={startTime}
            scheduleEndTime={endTime}
            onItemMoveUpdate={handleOnItemMove}
            onItemReturnListUpdate={handleOnItemReturnList}
            onItemDeivde={handleOnItemDeivde}
            onItemJoin={handleOnItemJoin}
            onItemShift={handleOnItemShift}
          />
          <Modal opened={invisibleRoomOpened} onClose={invisibleRoomClose} centered size={'45%'}>
            <RoomTemplate
              rooms={schedule.rooms}
              handleOnInvisibleRoomSave={handleOnInvisibleRoomSave}
            />
          </Modal>
          <Modal
            opened={scheduleTimeOpened}
            onClose={scheduleTimeClose}
            centered
            size={'20%'}
            title='利用時刻変更'
          >
            <ScheduleTimeTemplate
              initialScheduleStartTime={startTime}
              initialScheduleEndTime={endTime}
              roomItemList={roomItemList}
              handleOnScheduleTimeSave={handleOnScheduleTimeEdit}
            />
          </Modal>
        </>
      )}
    </div>
  )
}
export default TimeSchedule
