import { useEffect } from 'react'
import { useStoreon } from '../../context/storeon'

export const useTitle = (title: string) => {
  const { dispatch } = useStoreon('title')

  useEffect(() => dispatch('title/set', title), [title])
}
