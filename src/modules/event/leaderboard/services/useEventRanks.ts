import axios from 'axios'
import { useEffect, useState } from 'react'

interface Rank {
  id: string
  order: string
  name: string
  score: string
}

export const useEventRanks = (eventId: string, gameId: string) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<{
    updatedAt: Date
    columns: string[]
    ranks: {
      id: string
      order: string
      name: string
      score: {
        [key: string]: string
      }
      sums: string
    }[]
  }>({
    updatedAt: new Date(),
    columns: [],
    ranks: [],
  })
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    axios
      .get('/api/event/leaderboard', {
        params: {
          eventId: eventId,
          gameId,
        },
      })
      .then(({ data }) =>
        setData({
          ...data,
          updatedAt: new Date(data.updatedAt),
        })
      )
      .catch(e => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return {
    loading,
    data,
    error,
  }
}
