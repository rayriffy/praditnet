import { NextPage } from 'next'

import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/solid'

const Page: NextPage = () => {
  return (
    <div>
      <div className="mx-auto max-w-3xl mt-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <img className="h-8 w-auto" src="/assets/pamuse.svg" />
          <div className="border rounded px-2 py-1 flex items-center hover:cursor-pointer">
            <p className="text-gray-700 font-medium mr-2">
              8594
            </p>
            <CreditCardIcon className="w-6 h-6 text-gray-700" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 mt-14">
          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:shadow-lg hover:shadow-purple-500 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105 hover:cursor-pointer">
            <img
              src="/assets/logo/finale.png"
              className="h-24 w-auto mx-auto absolute -top-10 left-0 right-0"
            />
            <div className="mt-1 py-1 px-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Ray</p>
                <p className="text-sm">Rating: <b className="font-semibold">11.57</b></p>
              </div>
              <ArrowRightIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:shadow-lg hover:shadow-yellow-500 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105 hover:cursor-pointer">
            <img
              src="/assets/logo/chunithm.png"
              className="h-24 w-auto mx-auto absolute -top-10 left-0 right-0"
            />
            <div className="mt-1 py-1 px-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Ray</p>
                <p className="text-sm">Rating: <b className="font-semibold">14.71</b></p>
              </div>
              <ArrowRightIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-neutral-500 to-zinc-500 hover:shadow-lg hover:shadow-zinc-500 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105 hover:cursor-pointer">
            <img
              src="/assets/logo/ongeki.png"
              className="h-24 w-auto mx-auto absolute -top-10 left-0 right-0"
            />
            <div className="mt-1 py-1 px-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">RAY</p>
                <p className="text-sm">Rating: <b className="font-semibold">12.93</b></p>
              </div>
              <ArrowRightIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-sky-500 to-blue-400 hover:shadow-lg hover:shadow-blue-500 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105 hover:cursor-not-allowed grayscale">
            <img
              src="/assets/logo/maimai.png"
              className="h-24 w-auto mx-auto absolute -top-10 left-0 right-0"
            />
            <div className="mt-1 py-1 px-4 flex justify-center items-center h-full">
              <p className="text-sm">Unavailable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
