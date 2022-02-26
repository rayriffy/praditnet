import { memo } from 'react'
import NextImage from 'next/image'

import { encode, stringify } from 'querystring'

export const Image = memo<React.ComponentProps<typeof NextImage>>(props => (
  <NextImage
    loader={({ src, width, quality }) =>
      `https://praditnet-optimizer.rayriffy.com/_ipx/w_${width},q_${
        quality ?? 75
      }/${encodeURIComponent(src)}?${stringify({
        url: src,
        w: width,
        q: quality ?? 75,
      })}`
    }
    {...props}
  />
))
