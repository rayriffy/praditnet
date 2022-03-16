import { createKnexInstance } from '../../../../core/services/createKnexInstance'

interface Overview {
  total: number
  owned: number
}

export interface RarityOverview {
  n: Overview
  r: Overview
  sr: Overview
  srp: Overview
  ssr: Overview
}

export const getOverviewCard = async (
  cardId: string
): Promise<RarityOverview> => {
  const def = {
    total: 0,
    owned: 0,
  }

  const dicts: [keyof RarityOverview, string][] = [
    ['n', 'N'],
    ['r', 'R'],
    ['sr', 'SR'],
    ['srp', 'SRPlus'],
    ['ssr', 'SSR'],
  ]

  const knex = createKnexInstance()

  const overviews: [keyof RarityOverview, Overview][] = await Promise.all(
    dicts.map(async ([key, databaseKey]) => {
      const [cardRarityCount, ownedCount] = await Promise.all([
        await knex('praditnet_ongeki_card')
          .where({
            rarity: databaseKey,
          })
          .count(),
        await knex('ongeki_user_card')
          .join(
            'ongeki_user_data',
            'ongeki_user_card.user_id',
            'ongeki_user_data.id'
          )
          .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
          .where('sega_card.luid', '=', cardId)
          .join(
            'praditnet_ongeki_card',
            'ongeki_user_card.card_id',
            'praditnet_ongeki_card.id'
          )
          .where('praditnet_ongeki_card.rarity', '=', databaseKey)
          .count(),
      ])

      const overview: Overview = {
        owned: ownedCount[0]['count(*)'] as number,
        total: cardRarityCount[0]['count(*)'] as number,
      }

      return [key, overview]
    })
  )

  await knex.destroy()

  // @ts-ignore
  return Object.fromEntries(overviews)
}
