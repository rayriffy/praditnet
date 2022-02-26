import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Difficulty } from '../../../modules/chunithm/ranking/@types/Difficulty'
import Link from 'next/link'
import { Navbar } from '../../../modules/chunithm/home/components/navbar'
import { classNames } from '../../../core/services/classNames'

interface Props {
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
              <div key={`genre-${genre}`}>
                <div className="py-6 border-2 rounded-xl place-content-center flex mb-4">
                  <h2 className="text-xl font-bold">{genre}</h2>
                </div>
                <div className="space-y-4">
                  {musics.map(music => (
                    <Link
                      key={`genre-${genre}-music-${music.id}`}
                      href={`/chunithm/ranking/${currentDifficulty.key}/${music.id}`}
                    >
                      <a
                        key={`genre-${genre}-music-${music.id}`}
                        className={classNames(
                          currentDifficulty.color.secondary,
                          currentDifficulty.color.border,
                          'p-2 border-2 rounded-md flex justify-between space-x-2'
                        )}
                      >
                        <div className="w-full">
                          <p
                            className={classNames(
                              currentDifficulty.color.primary,
                              'uppercase text-sm font-extrabold text-white rounded px-2'
                            )}
                          >
                            {currentDifficulty.name}
                          </p>
                          <p className="bg-neutral-800 text-white mt-1 rounded-md px-2 py-2">
                            {music.name}
                          </p>
                        </div>
                        <div className="shrink-0 border-2 border-neutral-800 rounded-md w-14 bg-white flex flex-col">
                          <div className="uppercase text-xs bg-neutral-800 text-white py-0.5 text-center shrink-0">
                            level
                          </div>
                          <div className="h-full flex justify-center items-center">
                            {music.level}
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
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
