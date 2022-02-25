import Local from 'passport-local'

import { findUser } from './user/findUser'
import { validatePassword } from './user/validatePassword'

export const passportLocal = new Local.Strategy((username, password, done) => {
  findUser(username)
    .then(user => {
      if (user && validatePassword(user, password)) {
        done(null, user)
      } else {
        done(new Error('Username or password is incorrect!'))
      }
    })
    .catch(error => {
      done(error)
    })
})
