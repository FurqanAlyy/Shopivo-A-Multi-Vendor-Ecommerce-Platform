import PromotionBar from '../components/home/PromotionBar'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import TrendingProducts from '../components/home/TrendingProducts'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <>
      <PromotionBar />
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <TrendingProducts />
      </main>
      <Footer />
    </>
  )
}

export default Home