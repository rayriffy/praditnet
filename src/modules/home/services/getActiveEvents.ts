import { createKnexInstance } from '../../../core/services/createKnexInstance'

export const getActiveEvents = async () => {
  const knex = await createKnexInstance('praditnet')

  const activeEvents = await knex('Event').where({
    isOpen: true,
  })

  await knex.destroy()

  return activeEvents.map(event => ({
    id: event.uid,
    name: event.name,
    startAt: event.startAt,
    endAt: event.endAt,
  }))
}
