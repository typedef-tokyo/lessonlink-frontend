export type PrintItem = {
  room_name: string
  room_index: number
  items: ListItem[]
}

export type ListItem = {
  uniq_id: string
  start_time_hh: number
  start_time_mm: number
  end_time_hh: number
  end_time_mm: number
  start_time_index: number
  end_time_index: number
  lesson_name: string
  duration: number
}

export type PrintRoomItem = {
  uniq_id: string
  tag: 'lesson' | 'cleaning'
  start_time_hh: number
  start_time_mm: number
  end_time_hh: number
  end_time_mm: number
  start_time_index: number
  end_time_index: number
  lesson_name: string
  room_index: number
  duration: number
  widthPercent: number | null
}
