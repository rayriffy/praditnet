import axios from 'axios'

import { stringify } from 'querystring'

export const serverCaptcha = async (code: string | undefined) => {
  if (code === undefined || code === 'undefined') {
    throw new Error('Invalid ReCAPCHA V3 token!')
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

    console.log(`Score: ${googleResponse.data.score}`)

    if (googleResponse.data.success && googleResponse.data.score > 0.5) {
      return true
    } else {
      throw new Error("Server thinks you're a robot")
    }
  }
}
