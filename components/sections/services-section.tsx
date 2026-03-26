import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code2, Smartphone, Settings } from 'lucide-react'

const services = [
  {
    icon: Code2,
    title: 'Developpement d\'applications web sur mesure',
    description: 'De l\'idee au deploiement, je cree des applications web performantes adaptees a vos besoins specifiques. Technologies modernes, code maintenable, documentation complete.',
  },
  {
    icon: Smartphone,
    title: 'PWA - Progressive Web Apps',
    description: 'Transformez votre application web en app installable sur mobile et desktop. Fonctionnement hors ligne, notifications push, experience native sans passer par les stores.',
  },
  {
    icon: Settings,
    title: 'Consulting technique & architecture',
    description: 'Audit de votre code existant, recommandations d\'architecture, choix technologiques, accompagnement de vos equipes de developpement.',
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Services</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Comment je peux vous aider
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des solutions adaptees a chaque etape de votre projet digital
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group transition-all duration-300 hover:shadow-lg hover:border-primary/50"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
