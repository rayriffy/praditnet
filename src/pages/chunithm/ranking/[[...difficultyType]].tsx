import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { classNames } from '../../../core/services/classNames'
import { Navbar } from '../../../modules/chunithm/home/components/navbar'
import { MusicListingProps } from '../../../modules/chunithm/ranking/components/MusicListing'

import { Difficulty } from '../../../modules/chunithm/ranking/@types/Difficulty'
import { AppProps } from '../../../app/@types/AppProps'

const MusicListing = dynamic<MusicListingProps>(
  () =>
    import('../../../modules/chunithm/ranking/components/MusicListing').then(
      o => o.MusicListing
    ),
  { ssr: false }
)

interface Props extends AppProps {
  difficulties: Difficulty[]
  currentDifficulty: Difficulty | null
  musics: {
    [key: string]: {
      id: number
      name: string
      level: number
    }[] // key is genre name
  } | null
}

const Page: NextPage<Props> = props => {
  const { difficulties, currentDifficulty, musics } = props
  return (
    <div className="mt-4">
      <Navbar />
      <div className="my-4 grid gap-1 sm:gap-4 grid-cols-2 sm:grid-cols-4 max-w-xl mx-auto">
        {difficulties.map(difficulty => (
          <Link
            href={`/chunithm/ranking/${difficulty.key}`}
            key={`genre-selector-${difficulty.id}`}
          >
            <a
              className={classNames(
                difficulty.color.primary,
                difficulty.color.ring,
                'text-white py-1 px-4 rounded-md border-2 border-white hover:ring-2 transition text-center'
              )}
            >
              {difficulty.name}
            </a>
          </Link>
        ))}
      </div>
      <div className="space-y-4 mx-auto max-w-xl py-4">
        {musics !== null && (
          <Fragment>
            {Object.entries(musics).map(([genre, musics]) => (
              <MusicListing
                key={`musiclisting-${genre}`}
                {...{ genre, musics, currentDifficulty }}
              />
            ))}
          </Fragment>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )
  const { difficulties } = await import(
    '../../../modules/chunithm/ranking/constants/difficulties'
  )
  const { getGrouppedMusics } = await import(
    '../../../modules/chunithm/ranking/services/getGrouppedMusics'
  )

  // check for user session
  const user = await getApiUserSession(ctx.req)

  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  const { difficultyType = [null] } = ctx.params
  const targetDifficultyType = difficultyType[0]

  if (targetDifficultyType === null) {
    // musics is null
    return {
      props: {
        user: {
          aime: user.aimeCard,
          eamuse: user.eamuseCard,
        },
        difficulties,
        currentDifficulty: null,
        musics: null,
      },
    }
  } else {
    // if targetDifficultyType not match, then 404
    if (difficulties.find(o => o.key === targetDifficultyType) === undefined) {
      return {
        notFound: true,
      }
    } else {
      // get musics
      const musics = await getGrouppedMusics(
        targetDifficultyType as Difficulty['key']
      )

      return {
        props: {
          user: {
            aime: user.aimeCard,
            eamuse: user.eamuseCard,
          },
          difficulties,
          currentDifficulty: difficulties.find(
            o => o.key === targetDifficultyType
          ),
          musics: musics,
        },
      }
    }
  }
}

export default Page
