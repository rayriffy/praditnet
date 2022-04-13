import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { UserCard } from '../@types/UserCard'

export const getUserCard = async (
  userCardId: string,
  ongekiCardId: number
): Promise<UserCard | null> => {
  const knex = createKnexInstance()

  // check if user has card
  const targetUserCard = await knex('ongeki_user_card')
    .join('ongeki_user_data', 'ongeki_user_card.user_id', 'ongeki_user_data.id')
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .join(
      'praditnet.OngekiCard',
      'praditnet.OngekiCard.id',
      'ongeki_user_card.card_id'
    )
    .join(
      'praditnet.OngekiSkill',
      'praditnet.OngekiSkill.id',
      'ongeki_user_card.skill_id'
    )
    .where({
      luid: userCardId,
      'ongeki_user_card.card_id': ongekiCardId,
      is_acquired: 1,
    })
    .select(
      'praditnet.OngekiCard.id as cardId',
      'praditnet.OngekiCard.name as cardName',
      'praditnet.OngekiCard.nickname as cardNickname',
      'praditnet.OngekiCard.cardNumber as cardSerial',
      'praditnet.OngekiSkill.id as skillId',
      'praditnet.OngekiSkill.name as skillName',
      'praditnet.OngekiSkill.description as skillDescription',
      'praditnet.OngekiSkill.category as skillCategory',
      'ongeki_user_card.exp as exp',
      'ongeki_user_card.level as levelCurrent',
      'ongeki_user_card.max_level as levelMax',
      'ongeki_user_card.use_count as useCount',
      'ongeki_user_card.kaika_date as upgradeKaika',
      'ongeki_user_card.cho_kaika_date as upgradeChokaika'
    )
    .first()

  await knex.destroy()

  if (targetUserCard === undefined) {
    return null
  } else {
    return {
      card: {
        id: targetUserCard.cardId,
        name: targetUserCard.cardName,
        nickname: targetUserCard.cardNickname,
        serial: targetUserCard.cardSerial,
      },
      metadata: {
        use: targetUserCard.useCount,
        skill: {
          id: targetUserCard.skillId,
          name: targetUserCard.skillName,
          description: targetUserCard.skillDescription,
          category: targetUserCard.skillCategory,
        },
        exp: targetUserCard.exp,
        level: {
          current: targetUserCard.levelCurrent,
          max: targetUserCard.levelMax,
        },
        upgrade: {
          kaika: targetUserCard.upgradeKaika !== '0000-00-00 00:00:00.0',
          chokaika: targetUserCard.upgradeChokaika !== '0000-00-00 00:00:00.0',
        },
      },
    }
  }
}
