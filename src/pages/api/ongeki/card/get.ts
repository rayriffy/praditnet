import dayjs from 'dayjs'
import { NextApiHandler } from 'next'
import { getApiUserSession } from '../../../../core/services/authentication/api/getApiUserSession'
import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { serverCaptcha } from '../../../../core/services/serverCaptcha'

const api: NextApiHandler = async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    const { id } = req.body

    try {
      await serverCaptcha(req.headers['x-praditnet-capcha'] as string)
    } catch (e) {
      return res.status(400).send({
        message: e.message,
      })
    }

    const user = await getApiUserSession(req)

    const knex = createKnexInstance()

    try {
      // step 1, make sure it not dupe
      const databaseItem = await knex('ongeki_user_card')
        .join(
          'ongeki_user_data',
          'ongeki_user_card.user_id',
          'ongeki_user_data.id'
        )
        .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
        .where('sega_card.luid', '=', user.aimeCard)
        .where('ongeki_user_card.card_id', '=', id)
        .select(
          'ongeki_user_card.id as itemId',
          'ongeki_user_card.is_acquired as is_acquired'
        )

      if (databaseItem.length > 0) {
        if (databaseItem[0].is_acquired[0] === 0) {
          // set is acquired to 1
          await knex('ongeki_user_card')
            .where({
              id: databaseItem[0].itemId,
            })
            .update({
              is_acquired: true,
            })

          await knex.destroy()
          return res.status(200).send({
            message: 'Done!',
          })
        } else {
          await knex.destroy()

          return res.status(400).send({
            message: 'You already have this card!',
          })
        }
      }

      // step 2, add card with params
      const ongekiProfileId = await knex('ongeki_user_data')
        .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
        .where('sega_card.luid', '=', user.aimeCard)
        .select('ongeki_user_data.id as userId')
        .first()
      const targetCard = await knex('praditnet.OngekiCard')
        .where({
          id,
        })
        .select('skillId')

      if (targetCard.length === 0) {
        await knex.destroy()
        return res.status(404).send({
          message: 'Card not found!',
        })
      }

      await knex('ongeki_user_card').insert({
        analog_stock: 0,
        card_id: id,
        cho_kaika_date: '0000-00-00 00:00:00.0',
        created: dayjs().toDate(),
        digital_stock: 1,
        exp: 0,
        is_acquired: 1,
        is_new: 0,
        kaika_date: '0000-00-00 00:00:00.0',
        level: 1,
        max_level: 10,
        print_count: 0,
        skill_id: targetCard[0].skillId,
        use_count: 0,
        user_id: ongekiProfileId.userId,
      })

      await knex.destroy()
      return res.status(200).send({
        message: 'Done!',
      })
    } catch (e) {
      await knex.destroy()
    }
  } else {
    return res.status(405).send({
      message: 'Method Not Allowed',
    })
  }
}

export default api
