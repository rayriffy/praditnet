import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { collectionTypes } from '../constants/collectionTypes'

export const getCollection = async (itemType: string) => {
  const knex = createKnexInstance()

  const [equippableItems, items] = await Promise.all([
    knex('maimai_user_data')
      .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
      .where({
        luid: process.env.DEMO_LUID,
      })
      .join(
        'maimai_user_item',
        'maimai_user_item.user_id',
        'maimai_user_data.id'
      )
      .where({
        item_kind: collectionTypes.find(o => o.id === itemType).itemKind,
      })
      .select('maimai_user_item.item_id as itemId'),
    knex(`praditnet_finale_${itemType}`),
  ])

  await knex.destroy()

  return {
    type: itemType,
    equippable: equippableItems.map(o => o.itemId),
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      genre: item.genre,
    })),
  }
}
