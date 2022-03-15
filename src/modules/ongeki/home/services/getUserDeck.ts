import { sortBy } from 'lodash'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export interface Deck {
  id: number
  cards: Card[]
}

interface Card {
  order: number
  id: number
  name: string
  attribute: string
  skill: {
    id: number
    name: string
  }
  level: {
    current: number
    max: number
  }
}

interface DatabaseDeck {
  id: number
  deck_id: number
  user_id: number
  card_id1: number
  card_id2: number
  card_id3: number
}

export const getUserDeck = async (cardId: string): Promise<Deck[]> => {
  const knex = createKnexInstance()

  try {
    const userDecks: DatabaseDeck[] = await knex('ongeki_user_data')
      .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
      .where({
        luid: cardId,
      })
      .join(
        'ongeki_user_deck',
        'ongeki_user_data.id',
        'ongeki_user_deck.user_id'
      )
      .select(
        'ongeki_user_deck.id as id',
        'ongeki_user_deck.deck_id as deck_id',
        'ongeki_user_deck.user_id as user_id',
        'ongeki_user_deck.card_id1 as card_id1',
        'ongeki_user_deck.card_id2 as card_id2',
        'ongeki_user_deck.card_id3 as card_id3'
      )

    // transform user deck into usable data
    const transformedDeck: Deck[] = await Promise.all(
      userDecks.map(async userDeck => {
        const cards: Card[] = await Promise.all(
          [1, 2, 3].map(async key => {
            const targetCardId = userDeck[`card_id${key}`]

            const query = await knex('ongeki_user_card')
              .where({
                user_id: userDeck.user_id,
                card_id: targetCardId,
              })
              .join(
                'praditnet_ongeki_card',
                'ongeki_user_card.card_id',
                'praditnet_ongeki_card.id'
              )
              .join(
                'praditnet_ongeki_skill',
                'ongeki_user_card.skill_id',
                'praditnet_ongeki_skill.id'
              )
              .select(
                'praditnet_ongeki_card.id as cardId',
                'praditnet_ongeki_card.name as cardName',
                'ongeki_user_card.level as cardLevel',
                'praditnet_ongeki_card.attribute as cardAttribute',
                'ongeki_user_card.max_level as cardMaxLevel',
                'praditnet_ongeki_skill.id as skillId',
                'praditnet_ongeki_skill.name as skillName'
              )
              .first()

            return {
              order: key,
              id: query.cardId,
              name: query.cardName,
              attribute: query.cardAttribute,
              skill: {
                id: query.skillId,
                name: query.skillName,
              },
              level: {
                current: query.cardLevel,
                max: query.cardMaxLevel,
              },
            }
          })
        )

        return {
          id: userDeck.deck_id,
          cards: [1, 0, 2].map(key => cards[key]),
        }
      })
    )

    await knex.destroy()
    return sortBy(transformedDeck, 'id')
  } catch (e) {
    console.log(e)
    await knex.destroy()
    return []
  }
}