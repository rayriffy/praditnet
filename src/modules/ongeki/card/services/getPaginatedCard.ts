import { chunk } from 'lodash'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'

const paginationItems = 24

export const getPaginatedCard = async (cardId: string, page: number = 1) => {
  const knex = createKnexInstance()

  const [databaseUserCards, databaseCards, allCards] = await Promise.all([
    knex('ongeki_user_card')
      .join(
        'ongeki_user_data',
        'ongeki_user_card.user_id',
        'ongeki_user_data.id'
      )
      .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
      .where({
        luid: cardId,
      })
      .select(
        'ongeki_user_card.card_id as cardId',
        'ongeki_user_card.is_acquired as cardAcquired'
      ),
    knex('praditnet_ongeki_card')
      .where('praditnet_ongeki_card.id', '>', 3)
      .select('id as cardId', 'cardNumber as cardNumber', 'name as cardName')
      .orderBy('praditnet_ongeki_card.id', 'asc')
      .limit(paginationItems)
      .offset((page - 1) * paginationItems),
    knex('praditnet_ongeki_card').count(),
  ])

  await knex.destroy()

  const transformedCards = databaseCards.map(card => {
    const owned =
      databaseUserCards.find(
        o => Number(o.cardId) === Number(card.cardId) && o.cardAcquired[0] === 1
      ) !== undefined

    return {
      id: card.cardId,
      name: card.cardName,
      serial: card.cardNumber,
      owned,
    }
  })

  return {
    page: {
      current: page,
      max: chunk(
        Array.from({ length: allCards[0]['count(*)'] as number }),
        paginationItems
      ).length,
    },
    card: transformedCards,
  }
}
