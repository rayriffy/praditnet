import { useContext, useEffect } from 'react'

import { TitleContext } from '../../app/components/titleProvider'

export const useTitle = (title: string) => {
  const [, setTitle] = useContext(TitleContext)

  useEffect(() => setTitle(title), [title])
}
