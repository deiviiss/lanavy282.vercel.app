import { create } from 'zustand'

interface UIState {
  // Sidebar de carrito
  isSideCartOpen: boolean
  openSideCart: () => void
  closeSideCart: () => void
  toggleSideCart: () => void

  // Sidebar de categorías (mobile)
  isCategoriesOpen: boolean
  openCategories: () => void
  closeCategories: () => void
  toggleCategories: () => void
}

export const useUiStore = create<UIState>((set) => ({
  // Estado inicial del sidebar de carrito
  isSideCartOpen: false,
  openSideCart: () => { set({ isSideCartOpen: true }) },
  closeSideCart: () => { set({ isSideCartOpen: false }) },
  toggleSideCart: () => { set((state) => ({ isSideCartOpen: !state.isSideCartOpen })) },

  // Estado inicial del sidebar de categorías
  isCategoriesOpen: false,
  openCategories: () => { set({ isCategoriesOpen: true }) },
  closeCategories: () => { set({ isCategoriesOpen: false }) },
  toggleCategories: () => { set((state) => ({ isCategoriesOpen: !state.isCategoriesOpen })) }
}))
