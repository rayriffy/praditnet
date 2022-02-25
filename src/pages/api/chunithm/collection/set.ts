import { NextApiHandler } from 'next'
import { getApiUserSession } from '../../../../core/services/authentication/api/getApiUserSession'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { collectionTypes } from '../../../../modules/chunithm/collection/constants/collectionTypes'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { type, id } = req.body

    const user = await getApiUserSession(req)
    const targetAquaKey = collectionTypes.find(o => o.id === type).aquaKey

    const knex = createKnexInstance()

    try {
      await knex('chunew_user_data')
        .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
        .where({
          luid: user.card_luid,
        })
        .update(targetAquaKey, id)

      await knex.destroy()

      return res.status(200).send({
        message: 'success',
      })
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
