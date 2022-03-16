import axios from 'axios'

import { stringify } from 'querystring'

export const serverCapcha = async (code: string | undefined) => {
  if (code === undefined || code === 'undefined') {
    throw new Error('Invalid ReCAPCHA V2 token!')
  } else {
    const googleResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      stringify({
        secret: process.env.RECAPCHA_SECRET_KEY,
        response: code,
      }),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }
    )

    // console.log({
    //   code,
    //   response: googleResponse.data,
    // })

    if (googleResponse.data.success) {
      return true
    } else {
      throw new Error("Server thinks you're a robot")
    }
  }
}
