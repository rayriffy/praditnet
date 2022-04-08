import { FunctionComponent, useMemo } from 'react'

import Head from 'next/head'

import { useStoreon } from '../../context/storeon'

interface Props {
  title?: string
  description?: string
}

export const HeadTitle: FunctionComponent<Props> = props => {
  const {
    description = 'All-in-one stop to browse your data in Pradit Amusement',
    children,
  } = props

  const { title } = useStoreon('title')

  const transformedTitle = useMemo(
    () => (title ? `${title} · PraditNET` : 'PraditNET'),
    [title]
  )

  return (
    <Head>
      <title key="head-title">{transformedTitle}</title>
      <meta key="title" name="title" content={transformedTitle} />
      <meta key="description" name="description" content={description} />

      {children}
    </Head>
  )
}
