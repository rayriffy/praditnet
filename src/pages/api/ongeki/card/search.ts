import { NextApiHandler } from 'next'

import { chunk } from 'lodash'

import { paginationItems } from '../../../../core/constants/paginationItems'
import { getApiUserSession } from '../../../../core/services/authentication/api/getApiUserSession'
import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { CardSearchQuery } from '../../../../modules/ongeki/card/services/useCardSearch'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const inputUserId = req.query.user
    const page = Number(req.query.page)
    const query = JSON.parse(req.query.query as string) as CardSearchQuery

    const { text, rarity } = query as CardSearchQuery

    const user = await getApiUserSession(req)

    if (inputUserId !== user.uid) {
      return res.status(403).send({
        message: 'mismatched user',
      })
    }

    const rarityDicts: [string, string][] = [
      ['n', 'N'],
      ['r', 'R'],
      ['sr', 'SR'],
      ['srp', 'SRPlus'],
      ['ssr', 'SSR'],
    ]

    const filteredTextQuery = text.replace(/%/g, '')

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
          luid: user.aimeCard,
        })
        .select(
          'ongeki_user_card.card_id as cardId',
          'ongeki_user_card.is_acquired as cardAcquired'
        ),
      knex('praditnet.OngekiCard')
        .where('praditnet.OngekiCard.id', '>', 3)
        .select('id as cardId', 'cardNumber as cardNumber', 'name as cardName')
        .orderBy('praditnet.OngekiCard.id', 'asc')
        .limit(paginationItems)
        .offset((page - 1) * paginationItems)
        // filter
        .whereIn(
          'praditnet.OngekiCard.rarity',
          rarityDicts.filter(([key]) => rarity[key]).map(dict => dict[1])
        )
        .andWhere(builder => {
          return builder
            .orWhereLike('praditnet.OngekiCard.name', `%${filteredTextQuery}%`)
            .orWhereLike(
              'praditnet.OngekiCard.nickname',
              `%${filteredTextQuery}%`
            )
            .orWhereLike(
              'praditnet.OngekiCard.cardNumber',
              `%${filteredTextQuery}%`
            )
        }),
      knex('praditnet.OngekiCard')
        // filter
        .whereIn(
          'praditnet.OngekiCard.rarity',
          rarityDicts.filter(([key]) => rarity[key]).map(dict => dict[1])
        )
        .andWhere(builder => {
          return builder
            .orWhereLike('praditnet.OngekiCard.name', `%${filteredTextQuery}%`)
            .orWhereLike(
              'praditnet.OngekiCard.nickname',
              `%${filteredTextQuery}%`
            )
            .orWhereLike(
              'praditnet.OngekiCard.cardNumber',
              `%${filteredTextQuery}%`
            )
        })
        .count(),
    ])
    knex.destroy()

    const transformedCards = databaseCards.map(card => {
      const owned =
        databaseUserCards.find(
          o => Number(o.cardId) === Number(card.cardId)
        ) !== undefined

      return {
        id: card.cardId,
        name: card.cardName,
        serial: card.cardNumber,
        owned,
      }
    })

    res.setHeader('Cache-Control', 'max-age=2')

    return res.status(200).send({
      page: {
        current: page,
        max: chunk(
          Array.from({ length: allCards[0]['count(*)'] as number }),
          paginationItems
        ).length,
      },
      cards: transformedCards,
    })
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
