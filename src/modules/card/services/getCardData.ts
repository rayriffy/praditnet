import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { createKnexInstance } from '../../../core/services/createKnexInstance'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export const getCardData = async (card_luid: string | null) => {
  if (card_luid === null) {
    return {
      luid: null,
      createdAt: null,
    }
  }

  const knex = createKnexInstance()
  const segaCard = await knex('sega_card').where({
    luid: card_luid,
  })

  console.log(segaCard[0])

  const payload = {
    luid: segaCard[0].luid,
    createdAt: dayjs
      .tz(segaCard[0].register_time, 'Asia/Tokyo')
      .format('MM/YY'),
  }

  await knex.destroy()

  return payload
}
