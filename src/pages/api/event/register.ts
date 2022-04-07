import { NextApiHandler } from 'next'
import { getApiUserSession } from '../../../core/services/authentication/api/getApiUserSession'

import { createKnexInstance } from '../../../core/services/createKnexInstance'
import { serverCapcha } from '../../../core/services/serverCapcha'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { event, realName, inGameName, participatedGame, facebook } = req.body

    try {
      await serverCapcha(req.headers['x-praditnet-capcha'] as string)
    } catch (e) {
      return res.status(400).send({
        message: e.message,
      })
    }

    const user = await getApiUserSession(req)
    const knex = createKnexInstance('praditnet')

    // make sure user not registered yet
    const existingRegistration = await knex('EventAuditionRegister')
      .where({
        eventId: event,
        userId: user.uid,
      })
      .first()

    if (existingRegistration !== undefined) {
      await knex.destroy()
      return res.status(400).send({
        message: 'You already registered for this event.',
      })
    }

    // add user to competition
    await knex('EventAuditionRegister').insert({
      eventId: event,
      userId: user.uid,
      realName,
      inGameName,
      facebook,
      selectedGameId: participatedGame,
      remainingAttempts: 2,
    })

    await knex.destroy()

    return res.status(200).send({
      message: 'ok',
    })
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
