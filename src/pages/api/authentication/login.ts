import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import passport from 'passport'

import { setLoginSession } from '../../../core/services/authentication/session/setLoginSession'

import { User } from '../../../core/@types/User'
import { passportLocal } from '../../../core/services/authentication/passportLocal'

const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })(req, res)
  })

passport.use(passportLocal)

const api = nc<NextApiRequest, NextApiResponse>()
  .use(passport.initialize())
  .post(async (req, res) => {
    try {
      const user = (await authenticate('local', req, res)) as User
      // session is the payload to save in the token, it may contain basic info about the user
      const session = { ...user }

      await setLoginSession(res, session)

      res.status(200).send({ done: true })
    } catch (error) {
      console.error(error)
      res.status(401).send(error.message)
    }
  })

export default api
