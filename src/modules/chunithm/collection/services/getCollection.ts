import { capitalizeFirstCharacter } from '../../../../core/services/capitalizeFirstCharacter'
import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { collectionTypes } from '../constants/collectionTypes'

export const getCollection = async (cardId: string, itemType: string) => {
  const knex = createKnexInstance()

  const targetCollectionType = collectionTypes.find(o => o.id === itemType)

  const [
    // equippableItems,
    items,
  ] = await Promise.all([
    // knex('chunew_user_data')
    // .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
    //   .where({
    //     luid: process.env.DEMO_LUID,
    //   })
    //   .join(
    //     'maimai_user_item',
    //     'maimai_user_item.user_id',
    //     'maimai_user_data.id'
    //   )
    //   .where({
    //     item_kind: collectionTypes.find(o => o.id === itemType).itemKind,
    //   })
    //   .select('maimai_user_item.item_id as itemId'),
    knex(
      `praditnet.Chunithm${
        itemType.startsWith('avatar')
          ? 'AvatarAccessory'
          : `${capitalizeFirstCharacter(itemType)}`
      }`
    ).where(
      itemType.startsWith('avatar')
        ? {
            category: targetCollectionType.category,
          }
        : true
    ),
  ])

  await knex.destroy()

  return {
    type: itemType,
    items: items
      .map(item => ({
        id: item.id,
        name: item.name,
        works: item?.works ?? null,
        rarity: item?.rarity ?? null,
      }))
      .filter(o => !o.name.startsWith('CPU0')),
  }
}
