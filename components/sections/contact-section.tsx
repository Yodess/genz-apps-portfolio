'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Shield, Clock, Send, CheckCircle } from 'lucide-react'

const projectTypes = [
  { value: 'webapp', label: 'Application web sur mesure' },
  { value: 'pwa', label: 'PWA (Progressive Web App)' },
  { value: 'consulting', label: 'Consulting technique' },
  { value: 'other', label: 'Autre' },
]

const budgetRanges = [
  { value: 'under-2k', label: '< 2000 EUR' },
  { value: '2k-5k', label: '2000 EUR - 5000 EUR' },
  { value: '5k-10k', label: '5000 EUR - 10000 EUR' },
  { value: 'over-10k', label: '> 10000 EUR' },
  { value: 'unknown', label: 'Je ne sais pas encore' },
]

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    description: '',
    budget: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setIsSuccess(true)
        setFormData({
          name: '',
          email: '',
          projectType: '',
          description: '',
          budget: '',
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="devis" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Contact</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Pret a lancer votre projet ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Decrivez votre idee et recevez une reponse personnalisee sous 24h
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Reponse sous 24h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Donnees confidentielles</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <CardTitle className="mb-2">Demande envoyee !</CardTitle>
                  <CardDescription className="text-base">
                    Merci pour votre message. Je vous repondrai dans les plus brefs delais.
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => setIsSuccess(false)}
                  >
                    Envoyer une autre demande
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="name">Nom complet *</FieldLabel>
                        <Input
                          id="name"
                          placeholder="Jean Dupont"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">Email *</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jean@exemple.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="projectType">Type de projet *</FieldLabel>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                          required
                        >
                          <SelectTrigger id="projectType" className="w-full">
                            <SelectValue placeholder="Selectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="budget">Budget estime</FieldLabel>
                        <Select
                          value={formData.budget}
                          onValueChange={(value) => setFormData({ ...formData, budget: value })}
                        >
                          <SelectTrigger id="budget" className="w-full">
                            <SelectValue placeholder="Selectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="description">Description du projet *</FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Decrivez votre idee en quelques lignes : objectifs, fonctionnalites souhaitees, contraintes eventuelles..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </Field>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer ma demande
                        </>
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
