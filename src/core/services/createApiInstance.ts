import axios from 'axios'

export const createApiInstance = async (executeRecaptcha: Promise<string>) => {
  const token = await executeRecaptcha

  return axios.create({
    baseURL: '/api',
    headers: {
      'X-PraditNET-Capcha': token,
    },
  })
}
