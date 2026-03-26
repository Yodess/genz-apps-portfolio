import { Navbar } from '@/components/sections/navbar'
import { HeroSection } from '@/components/sections/hero-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ProcessSection } from '@/components/sections/process-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <ServicesSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
