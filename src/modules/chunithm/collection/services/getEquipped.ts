import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export const getEquipped = async (cardId: string) => {
  const knex = createKnexInstance()

  const databaseEquipped = await knex('chunew_user_data')
    .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
    .where({
      luid: cardId,
    })
    .join(
      'praditnet.ChunithmCharacter',
      'chunew_user_data.character_id',
      'praditnet.ChunithmCharacter.id'
    )
    .join(
      'praditnet.ChunithmNameplate',
      'chunew_user_data.nameplate_id',
      'praditnet.ChunithmNameplate.id'
    )
    .join(
      'praditnet.ChunithmSystemVoice',
      'chunew_user_data.voice_id',
      'praditnet.ChunithmSystemVoice.id'
    )
    .join(
      'praditnet.ChunithmMapIcon',
      'chunew_user_data.map_icon_id',
      'praditnet.ChunithmMapIcon.id'
    )
    .join(
      'praditnet.ChunithmFrame',
      'chunew_user_data.frame_id',
      'praditnet.ChunithmFrame.id'
    )
    .join(
      'praditnet.ChunithmTrophy',
      'chunew_user_data.trophy_id',
      'praditnet.ChunithmTrophy.id'
    )
    .select(
      'praditnet.ChunithmCharacter.id as characterId',
      'praditnet.ChunithmCharacter.name as characterName',
      'praditnet.ChunithmCharacter.works as characterWorks',
      'praditnet.ChunithmNameplate.id as nameplateId',
      'praditnet.ChunithmNameplate.name as nameplateName',
      'praditnet.ChunithmSystemVoice.id as systemVoiceId',
      'praditnet.ChunithmSystemVoice.name as systemVoiceName',
      'chunew_user_data.avatar_front as avatarFrontId',
      'chunew_user_data.avatar_head as avatarHeadId',
      'chunew_user_data.avatar_back as avatarBackId',
      'chunew_user_data.avatar_face as avatarFaceId',
      'chunew_user_data.avatar_item as avatarItemId',
      'chunew_user_data.avatar_skin as avatarSkinId',
      'chunew_user_data.avatar_wear as avatarWearId',
      'praditnet.ChunithmMapIcon.id as mapIconId',
      'praditnet.ChunithmMapIcon.name as mapIconName',
      'praditnet.ChunithmFrame.id as frameId',
      'praditnet.ChunithmFrame.name as frameName',
      'praditnet.ChunithmTrophy.id as trophyId',
      'praditnet.ChunithmTrophy.name as trophyName',
      'praditnet.ChunithmTrophy.rarity as trophyRarity'
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
    trophy: {
      id: selectedRow.trophyId,
      name: selectedRow.trophyName,
      rarity: selectedRow.trophyRarity,
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
