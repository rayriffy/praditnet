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
    await knex('ongeki_user_rival')
      .join(
        'ongeki_user_data',
        'ongeki_user_rival.user_id',
        'ongeki_user_data.id'
      )
      .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
      .where('sega_card.luid', '=', user.card_luid)
      .where('ongeki_user_rival.rival_user_id', '=', id)
      .delete()
    await knex.destroy()

    return res.status(200).send({
      message: 'rival removed',
    })
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
