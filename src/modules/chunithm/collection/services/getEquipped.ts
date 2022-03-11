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
      'chunew_user_data.character_id',
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
    .join(
      'praditnet_chunithm_mapIcon',
      'chunew_user_data.map_icon_id',
      'praditnet_chunithm_mapIcon.id'
    )
    .join(
      'praditnet_chunithm_frame',
      'chunew_user_data.frame_id',
      'praditnet_chunithm_frame.id'
    )
    .select(
      'praditnet_chunithm_character.id as characterId',
      'praditnet_chunithm_character.name as characterName',
      'praditnet_chunithm_character.works as characterWorks',
      'praditnet_chunithm_nameplate.id as nameplateId',
      'praditnet_chunithm_nameplate.name as nameplateName',
      'praditnet_chunithm_systemVoice.id as systemVoiceId',
      'praditnet_chunithm_systemVoice.name as systemVoiceName',
      'chunew_user_data.avatar_front as avatarFrontId',
      'chunew_user_data.avatar_head as avatarHeadId',
      'chunew_user_data.avatar_back as avatarBackId',
      'chunew_user_data.avatar_face as avatarFaceId',
      'chunew_user_data.avatar_item as avatarItemId',
      'chunew_user_data.avatar_skin as avatarSkinId',
      'chunew_user_data.avatar_wear as avatarWearId',
      'praditnet_chunithm_mapIcon.id as mapIconId',
      'praditnet_chunithm_mapIcon.name as mapIconName',
      'praditnet_chunithm_frame.id as frameId',
      'praditnet_chunithm_frame.name as frameName'
    )

  await knex.destroy()

  const selectedRow = databaseEquipped[0]

  return {
    character: {
      id: selectedRow.characterId,
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
    mapIcon: {
      id: selectedRow.mapIconId,
      name: selectedRow.mapIconName,
    },
    frame: {
      id: selectedRow.frameId,
      name: selectedRow.frameName,
    },
    avatarFront: {
      id: selectedRow.avatarFrontId,
      name: '',
    },
    avatarHead: {
      id: selectedRow.avatarHeadId,
      name: '',
    },
    avatarBack: {
      id: selectedRow.avatarBackId,
      name: '',
    },
    avatarFace: {
      id: selectedRow.avatarFaceId,
      name: '',
    },
    avatarItem: {
      id: selectedRow.avatarItemId,
      name: '',
    },
    avatarSkin: {
      id: selectedRow.avatarSkinId,
      name: '',
    },
    avatarWear: {
      id: selectedRow.avatarWearId,
      name: '',
    },
  }
}
