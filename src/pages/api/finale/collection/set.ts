import { NextApiHandler } from 'next'
import { getApiUserSession } from '../../../../core/services/authentication/api/getApiUserSession'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { serverCaptcha } from '../../../../core/services/serverCaptcha'
import { collectionTypes } from '../../../../modules/finale/collection/constants/collectionTypes'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { type, id } = req.body

    try {
      await serverCaptcha(req.headers['x-praditnet-capcha'] as string)
    } catch (e) {
      return res.status(400).send({
        message: e.message,
      })
    }

    const user = await getApiUserSession(req)
    const targetItemKind = collectionTypes.find(o => o.id === type).itemKind
    const targetAquaKey = collectionTypes.find(o => o.id === type).aquaKey

    const knex = createKnexInstance()

    try {
      const databaseItemCount = (
        await knex('maimai_user_data')
          .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
          .where({
            luid: user.aimeCard,
          })
          .join(
            'maimai_user_item',
            'maimai_user_item.user_id',
            'maimai_user_data.id'
          )
          .where({
            item_kind: targetItemKind,
            item_id: id,
          })
          .count()
      )[0]['count(*)']

      if (databaseItemCount === 0 && user.god_mode === 0) {
        // non eqipable because item still locked
        return res.status(400).send({
          message: 'not unlock yet',
        })
      } else {
        await knex('maimai_user_data')
          .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
          .where({
            luid: user.aimeCard,
          })
          .update(targetAquaKey, id)

        await knex.destroy()

        return res.status(200).send({
          message: 'success',
        })
      }
    } catch (e) {
      await knex.destroy()

      console.error(e)

      return res.status(500).send({
        message: 'failed to set',
      })
    }
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
