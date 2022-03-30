import { Knex } from 'knex'

export const getIsEventStaff = async (
  eventId: string,
  knex: Knex,
  userId: string
) => {
  const eventStaff = await knex('EventStaff')
    .where({
      eventId,
      userId,
    })
    .first()

  return eventStaff !== undefined
}
