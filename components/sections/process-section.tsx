import { Badge } from '@/components/ui/badge'
import { PhoneCall, FileText, Code, Rocket } from 'lucide-react'

const steps = [
  {
    icon: PhoneCall,
    number: '01',
    title: 'Appel decouverte',
    description: 'On discute de votre projet, vos objectifs, vos contraintes (30 min - gratuit)',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Devis detaille',
    description: 'Je vous envoie un devis precis avec planning et livrables (sous 48h)',
  },
  {
    icon: Code,
    number: '03',
    title: 'Developpement iteratif',
    description: 'Sprints de 2 semaines avec demos regulieres et ajustements',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Livraison & formation',
    description: 'Deploiement en production, formation a l\'utilisation, documentation complete',
  },
]

export function ProcessSection() {
  return (
    <section id="processus" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Processus</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Comment on travaille ensemble
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une methodologie claire et transparente pour mener votre projet a bien
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connector line for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-1rem)] h-px bg-border" />
                )}
                
                <div className="flex flex-col items-center text-center">
                  {/* Icon with number */}
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center group-hover:border-primary transition-colors">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
