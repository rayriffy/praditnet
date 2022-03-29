import { sortBy } from 'lodash'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { Card } from '../@types/Card'
import { Deck } from '../@types/Deck'
import { DatabaseDeck } from '../@types/DatabaseDeck'

export const getUserDeck = async (
  cardId: string,
  deckId: number
): Promise<Deck | null> => {
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
      .where({
        deck_id: deckId,
      })
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
                'praditnet.OngekiCard',
                'ongeki_user_card.card_id',
                'praditnet.OngekiCard.id'
              )
              .join(
                'praditnet.OngekiSkill',
                'ongeki_user_card.skill_id',
                'praditnet.OngekiSkill.id'
              )
              .select(
                'praditnet.OngekiCard.id as cardId',
                'praditnet.OngekiCard.name as cardName',
                'ongeki_user_card.level as cardLevel',
                'praditnet.OngekiCard.attribute as cardAttribute',
                'ongeki_user_card.max_level as cardMaxLevel',
                'praditnet.OngekiSkill.id as skillId',
                'praditnet.OngekiSkill.name as skillName'
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
    return transformedDeck.length === 0 ? null : transformedDeck[0]
  } catch (e) {
    console.log(e)
    await knex.destroy()
    return null
  }
}
