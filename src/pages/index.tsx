import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <div>
      <div className="mx-auto max-w-2xl mt-12">
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-sky-500 to-blue-400 px-5 py-4 rounded-2xl relative text-white pt-14">
            <div className="h-24 absolute -top-10 left-0 right-0">
              <img src="/assets/logo/maimai.png" className="h-full w-auto mx-auto" />
            </div>
            ok
          </div>
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-4 rounded-2xl relative text-white pt-14">
            <div className="h-24 absolute -top-10 left-0 right-0">
              <img src="/assets/logo/chunithm.png" className="h-full w-auto mx-auto" />
            </div>
            ok
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
