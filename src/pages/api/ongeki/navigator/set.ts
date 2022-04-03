import { NextApiHandler } from 'next'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { getApiUserSession } from '../../../../core/services/authentication/api/getApiUserSession'

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
    const userProfile = await knex('ongeki_user_data')
      .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
      .where('sega_card.luid', '=', user.aimeCard)
      .select(
        'ongeki_user_data.character_id as characterId',
        'ongeki_user_data.id as userId'
      )
      .first()

    if (userProfile.characterId === id) {
      return res.status(400).send({
        message: 'You already set this character as your navigator voice!',
      })
    } else {
      // make sure character id is ligit
      const character = await knex('ongeki_user_character').where({
        user_id: userProfile.userId,
        character_id: id,
      })

      if (character.length === 0) {
        return res.status(404).send({
          message: 'Character not found',
        })
      } else {
        await knex('ongeki_user_data')
          .where('ongeki_user_data.id', '=', userProfile.userId)
          .update({
            character_id: id,
          })

        return res.status(200).send({
          message: 'Done!',
        })
      }
    }
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
