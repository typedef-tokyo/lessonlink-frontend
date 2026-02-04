export type LessonItem = {
  type: 'list'
  tag: 'lesson'
  uniq_id: string
  item_id: number
  color: string
  name: string
  duration: number
  duration_time_unit_count: number
  offset_x_start: number | null
  offset_x_end: number | null
  offset_y_top: number | null
  offset_y_bottom: number | null
  delete: boolean
}

export type RoomItem = {
  type: 'room'
  tag: 'lesson' | 'cleaning'
  uniq_id: string
  item_id: number
  color: string
  name: string
  duration: number
  duration_time_unit_count: number
  start_time_hh: number
  start_time_mm: number
  end_time_hh: number
  end_time_mm: number
  start_time_index: number
  end_time_index: number
  room_index: number
  offset_x_start: number | null
  offset_x_end: number | null
  offset_y_top: number | null
  offset_y_bottom: number | null
  widthPercent: number | null
  leftPercent: number | null
  delete: boolean
}

export type CleaningItem = {
  type: ''
  tag: 'cleaning'
  uniq_id: string
  item_id: number
  color: string
  name: string
  duration: number
  duration_time_unit_count: number
  offset_x_start: number | null
  offset_x_end: number | null
  offset_y_top: number | null
  offset_y_bottom: number | null
  delete: boolean
}

export type ItemPayload = LessonItem | RoomItem | CleaningItem

export type DraggingInfo = ItemPayload & {
  dragging_x: number
  dragging_y: number
  offset_x: number
  offset_y: number
}
