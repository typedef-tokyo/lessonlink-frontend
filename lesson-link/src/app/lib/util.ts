import { HOUR_UNIT, UNIT_TIME_MINUTES } from '@constants/Constants'
import { formatInTimeZone } from 'date-fns-tz'
export const formatDate = (dateString: string): string => {
  const result = formatInTimeZone(dateString, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm')
  return result
}

export const calcStartTimeHH = (index: number, operatingStartTime: number): number => {
  return Math.trunc(index / HOUR_UNIT) + operatingStartTime
}

export const calcStartTimeMM = (index: number): number => {
  return (index % HOUR_UNIT) * UNIT_TIME_MINUTES
}

export const calcEndTimeHH = (index: number, operatingStartTime: number): number => {
  let hh = Math.trunc(index / HOUR_UNIT)
  const mm = calcEndTimeMM(index)
  if (mm === 0) {
    hh++
  }
  return hh + operatingStartTime
}

export const calcEndTimeMM = (index: number): number => {
  return ((index % HOUR_UNIT) * UNIT_TIME_MINUTES + UNIT_TIME_MINUTES) % 60
}

export const calcStartTime2Index = (
  timeHH: number,
  timeMM: number,
  operatingStartTime: number,
): number => {
  return timeHH * HOUR_UNIT + timeMM - operatingStartTime * HOUR_UNIT
}

export const calcEndTime2Index = (
  timeHH: number,
  timeMM: number,
  operatingStartTime: number,
): number => {
  return calcStartTime2Index(timeHH, timeMM, operatingStartTime) - 1
}

export const calcProcessTime = (processTimeMinutes: number) => {
  let processTimeMinutesUnit = Math.floor(processTimeMinutes)
  const remainder = processTimeMinutesUnit % UNIT_TIME_MINUTES

  if (remainder > 0) {
    processTimeMinutesUnit = processTimeMinutesUnit - remainder + UNIT_TIME_MINUTES
  }

  return processTimeMinutesUnit
}
