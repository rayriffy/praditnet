import { NextApiHandler } from 'next'

import { createKnexInstance } from '../../../core/services/createKnexInstance'
import { serverCapcha } from '../../../core/services/serverCapcha'
import { getApiUserSession } from '../../../core/services/authentication/api/getApiUserSession'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { eventId, submissionId, scores } = req.body

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

    // locate submission
    const targetSubmission = await knex('EventAuditionRecord')
      .where({
        eventId: eventId,
        userId: submissionId,
      })
      .select('selectedGameId', 'remainingAttempts')
      .first()

    if (targetSubmission === undefined) {
      await knex.destroy()
      return res.status(404).send({
        message: 'submission id not found',
      })
    } else if (targetSubmission.remainingAttempts < 1) {
      await knex.destroy()
      return res.status(400).send({
        message: 'this user have reached maximum attempts available',
      })
    }

    // push submission
    await knex('EventAuditionUser').insert(
      scores.map(score => ({
        eventId,
        userId: submissionId,
        gameId: targetSubmission.selectedGameId,
        musicId: score.id,
        score: score.score,
        metadata: JSON.stringify(score.metadata),
        attempt: 2 - targetSubmission.remainingAttempts + 1,
        recordedBy: user.uid,
      }))
    )
    await knex('EventAuditionRecord')
      .update({
        remainingAttempts: targetSubmission.remainingAttempts - 1,
      })
      .where({
        eventId: eventId,
        userId: submissionId,
      })
    await knex.destroy()

    return res.status(200).send({
      message: 'done',
    })
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
