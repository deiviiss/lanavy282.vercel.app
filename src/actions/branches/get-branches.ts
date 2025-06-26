'use server'

import { type Branch } from '@/lib/types'

export async function getBranches(): Promise<Branch[]> {
  const branches: Branch[] = [
    {
      id: 'bdd1d40e-0b4a-4b69-8c7f-a2f972419a9e',
      name: 'Matriz Área Ah Kim Pech',
      label: 'matriz',
      address: 'Av Adolfo Ruiz Cortinez, Área Ah Kim Pech, 24014 San Francisco de Campeche, Camp.',
      urlMap: 'https://maps.app.goo.gl/V1LmLCeCfjh4U3hd9',
      phone: '9811250049',
      // phone: '9811339534',
      phoneBot: null,
      phoneUser: null,
      hours: '8:00 AM - 14:00 PM',
      isOpen: true
    },
    {
      id: '3f8d66f4-2519-472c-a732-72e85a8b7152',
      name: 'Sucursal Bola de Queso',
      label: 'sucursal-bola-de-queso',
      address: 'Av. Maestros Campechanos, 24095 San Francisco de Campeche, Camp.',
      urlMap: 'https://maps.app.goo.gl/Ux8rMej9RuoeFrWm8',
      phone: '9818182204',
      phoneBot: null,
      phoneUser: null,
      hours: '08:00 AM - 14:00 PM',
      isOpen: true
    }
  ]

  if (!branches) return []

  return branches
}
