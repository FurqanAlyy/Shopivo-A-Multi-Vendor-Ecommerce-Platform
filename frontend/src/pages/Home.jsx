import PromotionBar from '../components/home/PromotionBar'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import TrendingProducts from '../components/home/TrendingProducts'
import Footer from '../components/home/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <PromotionBar />
      <Navbar />

      <main>
        <Hero />
        <Categories />
        <TrendingProducts />
      </main>

      <Footer />
    </div>
  )
}