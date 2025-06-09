import Header from '../../Header'
import heroImage from '../../assets/img/hero_img.webp'

export default function Hero() {
  return (
    <>
      <Header />
      <div
        className="relative px-6 md:px-20 bg-[#242525] flex flex-col-reverse md:flex-row justify-center items-center md:justify-between md:items-center min-h-screen md:min-h-[70vh]"
      >

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col justify-center gap-4 max-w-full md:max-w-xl text-center md:text-left">
          <h1 className="text-6xl md:text-[9rem] leading-tight md:leading-[1] text-white font-clash">
            Kairo
          </h1>
          <h2 className="text-3xl md:text-5xl text-white">
            Fashion that speaks
          </h2>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button className="px-6 py-2 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition">
              Shop New Arrivals
            </button>
            <button className="px-6 py-2 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition">
              Explore Collection
            </button>
          </div>
        </div>

        {/* Hero image */}
        <img
          src={heroImage}
          alt="Hero"
          className="relative z-10 h-48 sm:h-64 md:h-88 mt-8 md:mt-0 grayscale"
        />
      </div>
    </>
  )
}
