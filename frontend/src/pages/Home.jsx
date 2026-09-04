import PromotionBar from '../components/home/PromotionBar'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import Benefits from '../components/home/Benefits'
import Categories from '../components/home/Categories'
import TrendingProducts from '../components/home/TrendingProducts'
import MarketplaceBanner from '../components/home/MarketplaceBanner'
import NewArrivals from '../components/home/NewArrivals'
import BecomeSeller from '../components/home/BecomeSeller'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <PromotionBar />
      <Navbar />

      <main>
        <Hero />
        <Benefits />
        <Categories />
        <TrendingProducts />
        <MarketplaceBanner />
        <NewArrivals />
        <BecomeSeller />
      </main>

      <Footer />
    </div>
  )
}

export default Home