import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export const getEquipped = async () => {
  const knex = createKnexInstance()

  const databaseEquipped = await knex('maimai_user_data')
    .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
    .where({
      luid: process.env.DEMO_LUID,
    })
    .join('praditnet_finale_icon', 'maimai_user_data.icon_id', 'praditnet_finale_icon.id')
    .join('praditnet_finale_frame', 'maimai_user_data.frame_id', 'praditnet_finale_frame.id')
    .join('praditnet_finale_nameplate', 'maimai_user_data.nameplate_id', 'praditnet_finale_nameplate.id')
    .join('praditnet_finale_title', 'maimai_user_data.trophy_id', 'praditnet_finale_title.id')
    .select(
      'praditnet_finale_icon.id as iconId',
      'praditnet_finale_icon.name as iconName',
      'praditnet_finale_frame.id as frameId',
      'praditnet_finale_frame.name as frameName',
      'praditnet_finale_nameplate.id as nameplateId',
      'praditnet_finale_nameplate.name as nameplateName',
      'praditnet_finale_title.id as titleId',
      'praditnet_finale_title.name as titleName',
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
