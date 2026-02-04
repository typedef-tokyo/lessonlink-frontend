export const OWNER = 'owner'
export const EDITOR = 'editor'
export const VIEWER = 'viewer'

export const RoleMapKey2Name: Record<string, string> = {
  OWNER: 'オーナー',
  EDITOR: '編集者',
  VIEWER: '閲覧者',
}
export const RoleMapName2Key: Record<string, string> = {
  オーナー: OWNER,
  編集者: EDITOR,
  閲覧者: VIEWER,
}

export const RoleOptions = [
  { label: 'オーナー', value: OWNER },
  { label: '編集者', value: EDITOR },
  { label: '閲覧者', value: VIEWER },
]

export const ROUTES = {
  LOGIN: '/login',
  LESSON_EDIT: '/lesson-edit',
  ROOM_EDIT: '/room-edit',
  CAMPUS_SELECT: '/campus-select',
  SCHEDULE_LIST: (campus: string) => `/schedule-list/${campus}`,
  USER_LIST: '/user-list',
  TIME_SCHEDULE: (scheduleId: number) => `/time-schedule/${scheduleId}`,
  PRINT: (scheduleId: number) => `/print-out/${scheduleId}`,
} as const

export type CAMPUSES = 'shinjuku' | 'ikebukuro' | 'shibuya'

export const UNIT_TIME_MINUTES = 1

export const DISPLAY_WEIGHT_UNIT = 1000

export const HOUR_UNIT = 60 / UNIT_TIME_MINUTES

export const LESSON_COLOR_CODE = '#3232EE'
export const LESSON_COLOR = `bg-[#3232EE]`
export const CLEANING_COLOR = 'bg-[#10AA46]'
export const OVERLAP_COLOR = 'bg-[#ff1493]'

export const COLOR_MAP: Record<string, string> = {}
COLOR_MAP['lesson'] = LESSON_COLOR
COLOR_MAP['cleaning'] = CLEANING_COLOR

export const HEADER_MENU_NAME_MAP: Record<string, string> = {}
HEADER_MENU_NAME_MAP['lesson_edit'] = '講座編集'
HEADER_MENU_NAME_MAP['room_edit'] = 'ルーム編集'
HEADER_MENU_NAME_MAP['user_management'] = 'ユーザー管理'
HEADER_MENU_NAME_MAP['select_campus'] = 'キャンパス選択'
HEADER_MENU_NAME_MAP['log_out'] = 'ログアウト'

export const COLUMN_HEADER_WIDTH = 110

export const WorkTimeHours = Array.from({ length: 24 }, (_, index) => {
  const hourMod = index % 24
  const hourStr = hourMod.toString().padStart(2, '0')
  return {
    value: index.toString(),
    label: `${index}時 (${hourStr}:00)`,
  }
})

export const DURATIN_UNIT_HOUR = 4
