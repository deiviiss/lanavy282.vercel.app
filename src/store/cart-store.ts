import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/types'
import { getProductTotal } from '@/lib/utils'

interface CartItem {
  cartItemId: string
  product: Product
  quantity: number
}

interface CartState {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  getCartItemTotal: (cartItemId: string) => number
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product: Product) => {
        const options = product.options || []
        // Generate a unique identifier for the product considering its selected options (sorted by id)
        // This allows distinguishing different variants of the same product (e.g., with different ingredients)
        const optionsPart = options.length > 0
          ? `-${options
            .map(o => o.id)
            .sort((a, b) => (a ?? '').localeCompare(b ?? ''))
            .join('-')}`
          : ''
        const cartItemId = `${product.id}${optionsPart}`
        const cart = get().cart

        const existingItemIndex = cart.findIndex(item => item.cartItemId === cartItemId)

        if (existingItemIndex !== -1) {
          // Product already exists in the cart
          const updatedCart = [...cart]
          updatedCart[existingItemIndex].quantity += 1 // Only add 1 more unit
          set({ cart: updatedCart })
          return
        }

        // New product + options
        const newOptions = options.map(opt => ({
          ...opt,
          quantity: opt.quantity || 1
        }))

        const newItem: CartItem = {
          cartItemId,
          product: {
            ...product,
            options: newOptions
          },
          quantity: 1 // Only 1 unit of this combination
        }

        set({ cart: [...cart, newItem] })
      },

      removeFromCart: (cartItemId: string) => {
        set({ cart: get().cart.filter((item) => item.cartItemId !== cartItemId) })
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        const updatedCart = get().cart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
        set({ cart: updatedCart })
      },

      clearCart: () => {
        set({ cart: [] })
      },

      getCartItemTotal: (cartItemId: string) => {
        const cartItem = get().cart.find(item => item.cartItemId === cartItemId)
        if (!cartItem) return 0

        return getProductTotal(cartItem.product) * cartItem.quantity
      },

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().cart.reduce((total, item) => {
          return total + getProductTotal(item.product) * item.quantity
        }, 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)
