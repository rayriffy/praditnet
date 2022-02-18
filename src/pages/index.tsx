import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <div>
      <div className="mx-auto max-w-3xl mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 px-6">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105">
            <div className="h-24 absolute -top-10 left-0 right-0">
              <img src="/assets/logo/chunithm.png" className="h-full w-auto mx-auto" />
            </div>
            ok
          </div>
          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-500 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105">
            <div className="h-24 absolute -top-10 left-0 right-0">
              {/* <img src="/assets/logo/chunithm.png" className="h-full w-auto mx-auto" /> */}
            </div>
            ok
          </div>
          <div className="bg-gradient-to-r from-neutral-500 to-zinc-500 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105">
            <div className="h-24 absolute -top-10 left-0 right-0">
              {/* <img src="/assets/logo/chunithm.png" className="h-full w-auto mx-auto" /> */}
            </div>
            ok
          </div>
          <div className="bg-gradient-to-r from-sky-500 to-blue-400 px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105">
            <div className="h-24 absolute -top-10 left-0 right-0">
              <img src="/assets/logo/maimai.png" className="h-full w-auto mx-auto" />
            </div>
            ok
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
