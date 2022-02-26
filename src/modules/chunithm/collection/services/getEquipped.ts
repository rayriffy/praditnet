import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export const getEquipped = async (cardId: string) => {
  const knex = createKnexInstance()

  const databaseEquipped = await knex('chunew_user_data')
    .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
    .where({
      luid: cardId,
    })
    .join(
      'praditnet_chunithm_character',
      'chunew_user_data.chara_illust_id',
      'praditnet_chunithm_character.id'
    )
    .join(
      'praditnet_chunithm_nameplate',
      'chunew_user_data.nameplate_id',
      'praditnet_chunithm_nameplate.id'
    )
    .join(
      'praditnet_chunithm_systemVoice',
      'chunew_user_data.voice_id',
      'praditnet_chunithm_systemVoice.id'
    )
    .select(
      'chunew_user_data.chara_illust_id as iconId',
      'praditnet_chunithm_character.name as characterName',
      'praditnet_chunithm_character.works as characterWorks',
      'praditnet_chunithm_nameplate.id as nameplateId',
      'praditnet_chunithm_nameplate.name as nameplateName',
      'praditnet_chunithm_systemVoice.id as systemVoiceId',
      'praditnet_chunithm_systemVoice.name as systemVoiceName'
    )

  await knex.destroy()

  const selectedRow = databaseEquipped[0]

  return {
    icon: {
      id: selectedRow.iconId,
      name: selectedRow.characterName,
    },
    nameplate: {
      id: selectedRow.nameplateId,
      name: selectedRow.nameplateName,
    },
    systemVoice: {
      id: selectedRow.systemVoiceId,
      name: selectedRow.systemVoiceName,
    },
  }
}
