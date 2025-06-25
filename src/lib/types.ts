export interface ProductOption {
  id?: string
  productId: string
  name: string
  price: number
  type: 'size' | 'ingredient' | 'variable' | 'note'
  quantity: number
  isAvailable: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  isAvailable: boolean
  createdAt: Date
  options?: ProductOption[]
  groupedOptions?: Record<string, ProductOption[]>
  branches?: Branch[]
}

export interface Category {
  id: string
  name: string
  image: string | null
}

export interface Promotion {
  id: string
  name: string
  description: string
  discountPercentage: number
  originalPrice: number
  promoPrice: number
  image: string
  isActive: boolean
  categoryId: string
  createdAt: Date
}

export interface CartItemPayload {
  itemId: string
  categoryId: string
  quantity: number
  unitPrice: number
}

export interface Branch {
  id: string
  name: string
  label: string // Unique label for the branch, e.g., 'sucursal-1', 'sucursal-campeche'
  address: string
  urlMap?: string
  phone: string
  phoneBot: string | null
  phoneUser: string | null
  hours: string | null
  isOpen: boolean
  products?: Product[]
}
