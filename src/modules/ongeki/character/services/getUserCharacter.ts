import dayjs from 'dayjs'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export interface DetailedCharacter {
  id: number
  name: string
  relationshipLevel: number
  cardId: number
  height: number
  birthday: string
  bloodType: string
  voice: string
  personalityType: string
  personalityParam1: string
  personalityParam2: string
  personalityParam3: string
  personalityParam4: string
  personalityParam5: string
  personalityParam6: string
  personalityParam7: string
  personalityParam8: string
  personalityParam9: string
  personalityParam10: string
}

export const getUserCharacter = async (
  cardId: string,
  characterId: number
): Promise<DetailedCharacter> => {
  if (characterId < 1000 || characterId >= 2000) {
    throw new Error('not found')
  }

  const knex = createKnexInstance()

  const character = await knex('ongeki_user_character')
    .join(
      'ongeki_user_data',
      'ongeki_user_character.user_id',
      'ongeki_user_data.id'
    )
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .where('sega_card.luid', '=', cardId)
    .where('ongeki_user_character.character_id', '=', characterId)
    .join(
      'praditnet.OngekiCharacter',
      'ongeki_user_character.character_id',
      'praditnet.OngekiCharacter.id'
    )
    .select(
      'praditnet.OngekiCharacter.*',
      'ongeki_user_character.intimate_level as relationshipLevel'
    )
    .orderBy('ongeki_user_character.character_id', 'asc')
    .first()

  await knex.destroy()

  return {
    id: character.id,
    name: character.name,
    relationshipLevel: character.relationshipLevel,
    cardId: character.cardId,
    height: character.height,
    birthday: dayjs(character.birthday).format('DD MMM'),
    bloodType: character.bloodType,
    voice: character.voice,
    personalityType: character.personalityType,
    personalityParam1: character.personalityParam1,
    personalityParam2: character.personalityParam2,
    personalityParam3: character.personalityParam3,
    personalityParam4: character.personalityParam4,
    personalityParam5: character.personalityParam5,
    personalityParam6: character.personalityParam6,
    personalityParam7: character.personalityParam7,
    personalityParam8: character.personalityParam8,
    personalityParam9: character.personalityParam9,
    personalityParam10: character.personalityParam10,
  }
}
