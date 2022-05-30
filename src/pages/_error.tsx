import { NextPage } from 'next'

import { FaBomb } from 'react-icons/fa'

const Page: NextPage = props => {
  return (
    <div className="mt-20 mb-4 flex flex-col justify-center items-center">
      <FaBomb className="w-10 h-10 text-gray-700" />
    </div>
  )
}

export default Page
