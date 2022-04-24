import { NextPage } from 'next'

import { QuestionMarkCircleIcon } from '@heroicons/react/outline'

const Page: NextPage = props => {
  return (
    <div className="mt-20 mb-4 flex flex-col justify-center items-center">
      <QuestionMarkCircleIcon className="w-10 h-10 text-gray-700 dark:text-white" />
    </div>
  )
}

export default Page
