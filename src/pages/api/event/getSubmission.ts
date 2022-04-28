import { NextApiHandler } from 'next'

import { createKnexInstance } from '../../../core/services/createKnexInstance'
import { serverCapcha } from '../../../core/services/serverCapcha'
import { getApiUserSession } from '../../../core/services/authentication/api/getApiUserSession'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { eventId, submissionId } = req.body

    try {
      await serverCapcha(req.headers['x-praditnet-capcha'] as string)
    } catch (e) {
      return res.status(400).send({
        message: e.message,
      })
    }

    const user = await getApiUserSession(req)
    const knex = createKnexInstance('praditnet')

    // make sure user is staff
    const targetStaff = await knex('EventStaff')
      .where({
        eventId: eventId,
        userId: user.uid,
      })
      .first()

    if (targetStaff === undefined) {
      await knex.destroy()
      return res.status(403).send({
        message: "you're not staff",
      })
    }

    // locate user
    const targetSubmission = await knex('EventAuditionRecord')
      .where({
        eventId: eventId,
        userId: submissionId,
      })
      .select(
        'userId',
        'inGameName',
        'selectedGameId',
        'remainingAttempts',
        'shirtSize'
      )
      .first()
    await knex.destroy()

    if (targetSubmission === undefined) {
      return res.status(200).send({
        notFound: true,
      })
    } else {
      return res.status(200).send({
        userId: targetSubmission.userId,
        inGameName: targetSubmission.inGameName,
        selectedGameId: targetSubmission.selectedGameId,
        remainingAttempts: targetSubmission.remainingAttempts,
        shirtSize: targetSubmission.shirtSize ?? null,
      })
    }
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
