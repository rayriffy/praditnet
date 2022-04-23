import { NextApiHandler } from 'next'

import { toBuffer } from 'qrcode'

const api = async (req, res) => {
  const result = await toBuffer(req.query.data as string, {
    errorCorrectionLevel: 'L',
    margin: 0,
    width: Number(req.query.size),
  })

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Cache-Control', 's-maxage=15552000')
  return res.end(result)
}

export default api
