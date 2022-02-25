import { NextApiHandler } from 'next'

import { remove } from '../../../core/services/authentication/cookie/remove'

const api: NextApiHandler = async (req, res) => {
  remove(res)

  res.redirect('/')
}

export default api
