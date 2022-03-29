import { NextApiHandler } from 'next'

import { createKnexInstance } from '../../../core/services/createKnexInstance'
import { getApiUserSession } from '../../../core/services/authentication/api/getApiUserSession'
import { serverCapcha } from '../../../core/services/serverCapcha'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { cardId: inputCardId } = req.body

    try {
      await serverCapcha(req.headers['x-praditnet-capcha'] as string)
    } catch (e) {
      return res.status(400).send({
        message: e.message,
      })
    }

    const knex = createKnexInstance()
    const user = await getApiUserSession(req)

    const segaCard = await knex('sega_card')
      .where({
        luid: inputCardId,
      })
      .count()

    if (user.card_luid !== null && segaCard[0]['count(*)'] !== 0) {
      // if user have card already, make sure card does not registered in db yet
      await knex.destroy()
      return res.status(400).send({
        message: 'You cannot add card that already existed in the system!',
      })
    } else if (user.card_luid === null && segaCard[0]['count(*)'] === 0) {
      // new user, make sure card is in the system
      await knex.destroy()
      return res.status(400).send({
        message:
          'This card does not exist in the system! Please at least play one game first',
      })
    }

    // make sure that card does not used by anyone else yet
    const userDatas = await knex('praditnet.UserData')
      .where({
        card_luid: inputCardId,
      })
      .count()
    if (userDatas[0]['count(*)'] !== 0) {
      await knex.destroy()
      return res.status(400).send({
        message: 'Card already used by someone else!',
      })
    }

    // all clear!, make changes to db
    await Promise.all([
      knex('praditnet.UserData')
        .update({
          card_luid: inputCardId,
        })
        .where({
          uid: user.uid,
        }),
      knex('sega_card')
        .update({
          luid: inputCardId,
        })
        .where({
          luid: user.card_luid,
        }),
    ])

    await knex.destroy()
    return res.status(200).send({
      message: 'Successfully added card!',
    })
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
