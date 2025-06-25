// Archivo: PrivacyPolicyPage.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const sections = [
  {
    title: '1. Información que recopilamos',
    content: [
      'Recopilamos información personal cuando el usuario contacta al negocio mediante WhatsApp, realiza un pedido o deja un comentario en el mensaje.',
      'La información puede incluir nombre, número de teléfono, y contenido del mensaje enviado a través de WhatsApp.'
    ]
  },
  {
    title: '2. Uso de la información',
    content: [
      'La información proporcionada se utiliza únicamente para procesar los pedidos, brindar atención al cliente y mejorar el servicio.',
      'No se comparte ni se vende la información a terceros.'
    ]
  },
  {
    title: '3. Seguridad',
    content: [
      'Tomamos medidas razonables para proteger los datos recibidos a través de WhatsApp, pero no garantizamos la seguridad total debido a la naturaleza del medio.',
      'El almacenamiento de datos es responsabilidad exclusiva del negocio receptor.'
    ]
  },
  {
    title: '4. Contacto',
    content: [
      'Si tienes dudas sobre esta política, puedes comunicarte directamente con el negocio a través del número de WhatsApp disponible en el menú digital.'
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.header
        className="sticky top-0 z-20 w-full border-b bg-background"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="container flex h-16 items-center px-4 md:px-6">
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center gap-2 text-primary">
              <ArrowLeft className="h-4 w-4" />
              Volver a inicio
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              className="mx-auto max-w-3xl space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="space-y-2">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Política de Privacidad
                </motion.h1>
                <motion.p
                  className="text-muted-foreground md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Información sobre el uso y manejo de datos personales al realizar pedidos.
                </motion.p>
              </div>

              <motion.div className="space-y-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    className="rounded-lg border border-secondary bg-background p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <h2 className="text-xl font-semibold text-primary mb-4">{section.title}</h2>
                    <ul className="list-disc pl-6 space-y-2 text-foreground">
                      {section.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex justify-center pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/" className="text-primary hover:text-primary/80 flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la página principal
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
