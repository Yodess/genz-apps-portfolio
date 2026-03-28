import { Navbar } from '@/components/sections/navbar'
import { HeroSection } from '@/components/sections/hero-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ProcessSection } from '@/components/sections/process-section'
import { ContactSection } from '@/components/sections/contact-section'
import { Footer } from '@/components/sections/footer'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'GenZ Apps',
  url: 'https://www.genz-apps.com',
  description: 'Développeur full-stack spécialisé en applications web et PWA sur mesure pour les entreprises et commerces.',
  areaServed: {
    '@type': 'Country',
    name: 'Algeria',
  },
  knowsAbout: ['Next.js', 'React', 'PWA', 'TypeScript', 'PostgreSQL', 'Applications métier'],
  offers: {
    '@type': 'Offer',
    description: 'Développement d\'applications web et PWA sur mesure',
    areaServed: 'Algeria',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
