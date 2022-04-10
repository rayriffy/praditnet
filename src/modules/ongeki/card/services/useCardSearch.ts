import { useCallback, useEffect, useState } from 'react'

import axios from 'axios'

import { useDebounce } from '../../../../core/services/useDebounce'

import { Card } from '../@types/Card'

export interface CardSearchQuery {
  text: string
  rarity: {
    n: boolean
    r: boolean
    sr: boolean
    srp: boolean
    ssr: boolean
  }
}

export const useCardSearch = (userId: string, query: CardSearchQuery) => {
  const debouncedQuery = useDebounce(query, 600)

  const [loading, setLoading] = useState<boolean>(true)
  const [cards, setCards] = useState<Card[]>([])
  const [pagination, setPagination] = useState<{
    current: number
    max: number
  }>({
    current: 1,
    max: 1,
  })

  const fetchCards = async () => {
    console.log('fetch')
    // query
    axios
      .get(`/api/ongeki/card/search`, {
        params: {
          user: userId,
          query,
          page: pagination.current,
        },
      })
      .then(({ data }) => {
        setCards(data.cards)
        setPagination(prev => ({
          ...prev,
          max: data.page.max,
        }))
        setLoading(false)
      })
  }

  const refetch = () => {
    fetchCards()
  }

  const onPaginate = useCallback(
    (leapSize: number) => {
      setPagination(prev => ({
        ...prev,
        current: prev.current + leapSize,
      }))
    },
    [pagination]
  )

  useEffect(() => {
    if (pagination.current !== 1) {
      setPagination(prev => ({
        ...prev,
        current: 1,
      }))
    } else {
      setLoading(true)
      setCards([])
      fetchCards()
    }
  }, [
    debouncedQuery.text,
    debouncedQuery.rarity.n,
    debouncedQuery.rarity.r,
    debouncedQuery.rarity.sr,
    debouncedQuery.rarity.srp,
    debouncedQuery.rarity.ssr,
  ])

  useEffect(() => {
    setLoading(true)
    setCards([])

    fetchCards()
  }, [pagination.current, debouncedQuery.text])

  return {
    loading,
    cards,
    pagination,
    onPaginate,
    refetch,
  }
}
