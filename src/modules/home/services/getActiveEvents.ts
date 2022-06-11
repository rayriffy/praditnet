import { Knex } from 'knex'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getActiveEvents = async (knex: Knex) => {
  const activeEvents = await knex('praditnet.Event').where(
    'endAt',
    '>=',
    dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD')
  )

  return activeEvents.map(event => ({
    id: event.uid,
    name: event.name,
    startAt: event.startAt,
    endAt: event.endAt,
  }))
}
