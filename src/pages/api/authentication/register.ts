import { NextApiHandler } from 'next'

import { createUser } from '../../../core/services/authentication/user/createUser'

const api: NextApiHandler = async (req, res) => {
  try {
    const { username, password } = req.body

    await createUser(username, password)

    res.status(200).send({ done: true })
  } catch (e) {
    console.error(e)
    res.status(500).end(e.message)
  }
}

export default api
