import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelectedWorks from './components/SelectedWorks'
import About from './components/About'
import BookSession from './components/BookSession'
import Footer from './components/Footer'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen w-full bg-black text-neutral-100 selection:bg-white/10">
        <Navbar />
        <Hero />
        <SelectedWorks />
        <About />
        <BookSession />
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App
