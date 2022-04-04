import { GetServerSideProps, NextPage } from 'next'

import { classNames } from '../../../../core/services/classNames'
import { Image } from '../../../../core/components/image'
import { Navbar } from '../../../../modules/chunithm/home/components/navbar'

import { Difficulty } from '../../../../modules/chunithm/ranking/@types/Difficulty'
import { AppProps } from '../../../../app/@types/AppProps'

interface Props extends AppProps {
  music: {
    id: number
    name: string
    artist: string
    level: number
  }
  difficulty: Difficulty
  selfScore: number | null
  leaderboard: {
    playerName: string
    score: number
  }[]
}

const Page: NextPage<Props> = props => {
  const { music, difficulty, selfScore, leaderboard } = props

  return (
    <div className="mt-4">
      <Navbar />
      <div className="mx-auto max-w-xl">
        <div className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 p-6 rounded-md sm:flex">
          <div className="w-64 sm:w-48 shrink-0 mx-auto sm:mx-0 mb-4 sm:mb-0">
            <Image
              className="overflow-hidden rounded-md"
              src={`https://cdn.pradit.net/chunithm/jacket/${music.id}.png`}
              width={300}
              height={300}
            />
          </div>
          <div className="sm:ml-6 flex flex-col justify-between w-full">
            <div>
              <h1 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                {music.name}
              </h1>
              <h2 className="text-gray-700 text-sm sm:text-base dark:text-gray-300">
                {music.artist}
              </h2>
            </div>
            <div
              className={classNames(
                difficulty.color.secondary,
                difficulty.color.border,
                'w-full border-2 rounded-md p-1.5 mt-4 sm:mt-0'
              )}
            >
              <p
                className={classNames(
                  difficulty.color.primary,
                  'uppercase text-xs font-extrabold text-white rounded px-2 mb-2'
                )}
              >
                {difficulty.name}
              </p>
              <div className="bg-neutral-700 text-white rounded px-2 py-0.5 text-sm flex justify-between">
                <p>Your score</p>
                <p>{selfScore === null ? '-' : selfScore.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-gray-800 font-bold text-2xl sm:text-3xl mt-6 mb-2 dark:text-white">
          Leaderboard
        </h1>
        <div className="dark:text-white">
          {leaderboard.map(({ playerName, score }, i) => (
            <div
              key={`leaderboard-${playerName}-${i}`}
              className="flex justify-between"
            >
              <p>{playerName}</p>
              <p>{score.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../../core/services/authentication/api/getApiUserSession'
  )
  const { difficulties } = await import(
    '../../../../modules/chunithm/ranking/constants/difficulties'
  )
  const { getMusic } = await import(
    '../../../../modules/chunithm/ranking/services/getMusic'
  )
  const { getUserPlayscore } = await import(
    '../../../../modules/chunithm/ranking/services/getUserPlayscore'
  )
  const { getRanking } = await import(
    '../../../../modules/chunithm/ranking/services/getRanking'
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

  // if no target diffiulty, then 404
  const targetDifficulty = difficulties.find(
    o => o.key === ctx.params.difficultyType
  )
  if (!targetDifficulty) {
    return {
      notFound: true,
    }
  }

  // check if music exists
  const targetMusic = await getMusic(
    Number(ctx.params.musicId),
    targetDifficulty.key
  )
  if (targetMusic === null) {
    return {
      notFound: true,
    }
  } else {
    // get user's playscore, and ranking
    const [selfScore, rankings] = await Promise.all([
      getUserPlayscore(
        user.aimeCard,
        Number(ctx.params.musicId),
        targetDifficulty.id
      ),
      getRanking(Number(ctx.params.musicId), targetDifficulty.id),
    ])

    return {
      props: {
        user: {
          aime: user.aimeCard,
          eamuse: user.eamuseCard,
        },
        music: targetMusic,
        difficulty: targetDifficulty,
        selfScore,
        leaderboard: rankings,
      },
    }
  }
}

export default Page
