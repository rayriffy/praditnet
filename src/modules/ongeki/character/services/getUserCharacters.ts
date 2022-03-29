import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export interface UserCharacter {
  id: number
  name: string
  relationshipLevel: number
  cardId: number
}

export const getUserCharacters = async (
  cardId: string
): Promise<UserCharacter[]> => {
  const knex = createKnexInstance()

  const characters = await knex('ongeki_user_character')
    .join(
      'ongeki_user_data',
      'ongeki_user_character.user_id',
      'ongeki_user_data.id'
    )
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .where('sega_card.luid', '=', cardId)
    .where('ongeki_user_character.character_id', '>=', 1000)
    .where('ongeki_user_character.character_id', '<', 2000)
    .join(
      'praditnet.OngekiCharacter',
      'ongeki_user_character.character_id',
      'praditnet.OngekiCharacter.id'
    )
    .select(
      'praditnet.OngekiCharacter.id as characterId',
      'praditnet.OngekiCharacter.name as characterName',
      'praditnet.OngekiCharacter.cardId as characterCardId',
      'ongeki_user_character.intimate_level as relationshipLevel'
    )
    .orderBy('ongeki_user_character.character_id', 'asc')

  await knex.destroy()

  return characters.map(character => ({
    id: character.characterId,
    name: character.characterName,
    relationshipLevel: character.relationshipLevel,
    cardId: character.characterCardId,
  }))
}
