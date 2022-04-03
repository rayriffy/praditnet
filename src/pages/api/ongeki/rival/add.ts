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

    // check if user already set navi
    const knex = createKnexInstance()

    // get user id
    const [userProfile, targetUserCount] = await Promise.all([
      knex('ongeki_user_data')
        .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
        .where('sega_card.luid', '=', user.aimeCard)
        .select('ongeki_user_data.id as userId')
        .first(),
      knex('ongeki_user_data').where('id', '=', Number(id)).count(),
    ])

    if (Number(id) === Number(userProfile.userId)) {
      // if user is himself
      await knex.destroy()
      return res.status(400).send({
        message: 'cannot add yourself as rival',
      })
    } else if (targetUserCount[0]['count(*)'] === 0) {
      // no user found
      await knex.destroy()
      return res.status(404).send({
        message: 'target user not found',
      })
    }

    // check if rival already added
    const targetRivalCount = await knex('ongeki_user_rival')
      .where('user_id', '=', userProfile.userId)
      .where('rival_user_id', '=', Number(id))
      .count()
    if (targetRivalCount[0]['count(*)'] !== 0) {
      await knex.destroy()
      return res.status(400).send({
        message: 'rival already added',
      })
    } else {
      await knex('ongeki_user_rival').insert({
        user_id: userProfile.userId,
        rival_user_id: Number(id),
      })

      await knex.destroy()
      return res.status(200).send({
        message: 'rival removed',
      })
    }
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
