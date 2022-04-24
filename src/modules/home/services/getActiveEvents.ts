import { Knex } from 'knex'

export const getActiveEvents = async (knex: Knex) => {
  const activeEvents = await knex('praditnet.Event').where({
    isOpen: true,
  })

  return activeEvents.map(event => ({
    id: event.uid,
    name: event.name,
    startAt: event.startAt,
    endAt: event.endAt,
  }))
}
