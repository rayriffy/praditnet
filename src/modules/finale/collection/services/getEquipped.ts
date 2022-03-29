import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export const getEquipped = async (cardId: string) => {
  const knex = createKnexInstance()

  const databaseEquipped = await knex('maimai_user_data')
    .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
    .where({
      luid: cardId,
    })
    .join(
      'praditnet.FinaleIcon',
      'maimai_user_data.icon_id',
      'praditnet.FinaleIcon.id'
    )
    .join(
      'praditnet.FinaleFrame',
      'maimai_user_data.frame_id',
      'praditnet.FinaleFrame.id'
    )
    .join(
      'praditnet.FinaleNameplate',
      'maimai_user_data.nameplate_id',
      'praditnet.FinaleNameplate.id'
    )
    .join(
      'praditnet.FinaleTitle',
      'maimai_user_data.trophy_id',
      'praditnet.FinaleTitle.id'
    )
    .select(
      'praditnet.FinaleIcon.id as iconId',
      'praditnet.FinaleIcon.name as iconName',
      'praditnet.FinaleFrame.id as frameId',
      'praditnet.FinaleFrame.name as frameName',
      'praditnet.FinaleNameplate.id as nameplateId',
      'praditnet.FinaleNameplate.name as nameplateName',
      'praditnet.FinaleTitle.id as titleId',
      'praditnet.FinaleTitle.name as titleName'
    )

  await knex.destroy()

  const selectedRow = databaseEquipped[0]

  return {
    icon: {
      id: selectedRow.iconId,
      name: selectedRow.iconName,
    },
    frame: {
      id: selectedRow.frameId,
      name: selectedRow.frameName,
    },
    nameplate: {
      id: selectedRow.nameplateId,
      name: selectedRow.nameplateName,
    },
    title: {
      id: selectedRow.titleId,
      name: selectedRow.titleName,
    },
  }
}
