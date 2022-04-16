import dayjs from 'dayjs'
import { NextApiHandler } from 'next'
import { getApiUserSession } from '../../../../core/services/authentication/api/getApiUserSession'
import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { serverCapcha } from '../../../../core/services/serverCapcha'

const api: NextApiHandler = async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    const { id } = req.body

    try {
      await serverCapcha(req.headers['x-praditnet-capcha'] as string)
    } catch (e) {
      return res.status(400).send({
        message: e.message,
      })
    }

    const user = await getApiUserSession(req)
    const knex = createKnexInstance()

    try {
      // make sure that card exists
      const targetCard = await knex('ongeki_user_card')
        .join(
          'ongeki_user_data',
          'ongeki_user_card.user_id',
          'ongeki_user_data.id'
        )
        .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
        .join(
          'praditnet.OngekiCard',
          'praditnet.OngekiCard.id',
          'ongeki_user_card.card_id'
        )
        .where({
          luid: user.aimeCard,
          'ongeki_user_data.card_id': Number(id),
          is_acquired: 1,
        })
        .select(
          'kaika_date',
          'max_level',
          'pradit.OngekiCard.rarity',
          'level',
          'cho_kaika_date',
          'print_count',
          'pradit.OngekiCard.chokaikaSkillId'
        )
        .first()

      if (targetCard === undefined) {
        await knex.destroy()
        return res.status(404).send({
          message: 'User not owned this card yet',
        })
      }

      if (
        targetCard.kaika_date === '0000-00-00 00:00:00.0' ||
        // if card rarity is N, expected max level is 100
        (targetCard.rarity === 'N' &&
          (targetCard.max_level !== 100 || targetCard.level !== 100)) ||
        // otherwise, expected max level is 70
        (targetCard.rarity !== 'N' &&
          (targetCard.max_level !== 70 || targetCard.level !== 70))
      ) {
        await knex.destroy()
        return res.status(400).send({
          message: 'Requirements has not been met',
        })
      } else if (targetCard.cho_kaika_date !== '0000-00-00 00:00:00.0') {
        await knex.destroy()
        return res.status(400).send({
          message: 'This card has already been sparked to cho-kaika',
        })
      }

      await knex('ongeki_user_card')
        .join(
          'ongeki_user_data',
          'ongeki_user_card.user_id',
          'ongeki_user_data.id'
        )
        .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
        .where({
          luid: user.aimeCard,
          card_id: Number(id),
          is_acquired: 1,
        })
        .update({
          print_count: targetCard.print_count + 1,
          skill_id: targetCard.chokaikaSkillId,
          cho_kaika_date: dayjs().format('YYYY-MM-DD HH:MM:ss.0'),
        })

      await knex.destroy()
      return res.status(200).send({
        message: 'Done!',
      })
    } catch (e) {
      console.error(e)
    }
  } else {
    return res.status(405).send({
      message: 'Method Not Allowed',
    })
  }
}

export default api
