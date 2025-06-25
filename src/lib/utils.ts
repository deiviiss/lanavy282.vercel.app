import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Product } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

export function getProductTotal(product: Product): number {
  const basePrice = product.price
  const optionsPrice = (product.options || []).reduce((total, option) => {
    const optionPrice = option.price || 0
    const optionQuantity = option.quantity || 1
    return total + optionPrice * optionQuantity
  }, 0)

  return basePrice + optionsPrice
}
