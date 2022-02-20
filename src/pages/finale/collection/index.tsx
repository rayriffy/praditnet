import { GetServerSideProps, NextPage } from 'next'

interface Props {
  icon: {
    id: number
    name: string
  }
  frame: {
    id: number
    name: string
  }
  nameplate: {
    id: number
    name: string
  }
  title: {
    id: number
    name: string
  }
}

const Page: NextPage<Props> = props => {
  const { icon, frame, nameplate, title } = props

  console.log({ icon, frame, nameplate, title })

  return (
    <>k</>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getEquipped } = await import('../../../modules/finale/collection/services/getEquipped')

  const equipped = await getEquipped()

  ctx.res.setHeader('Cache-Control', 'max-age=60, public')

  return {
    props: {
      ...equipped
    }
  }
}

export default Page
