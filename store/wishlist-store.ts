import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WishlistItem } from '@/types'

interface WishlistStore {
  items: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  getItemCount: () => number
  getTotalValue: () => number
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === item.id)
          
          if (existingItem) {
            // Item already exists, don't add duplicate
            return state
          }
          
          return {
            items: [...state.items, { ...item, addedAt: new Date() }]
          }
        })
      },
      
      removeFromWishlist: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id)
      },
      
      getItemCount: () => {
        return get().items.length
      },
      
      getTotalValue: () => {
        return get().items.reduce((total, item) => total + item.price, 0)
      }
    }),
    {
      name: 'walnut-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
