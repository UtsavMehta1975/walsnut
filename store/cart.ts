import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Cart } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCart: () => Cart
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.productId === item.productId)
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          }
          
          return {
            items: [...state.items, { ...item, id: `RS{item.productId}-RS{Date.now()}` }]
          }
        })
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getCart: () => {
        const state = get()
        const total = state.getTotal()
        const itemCount = state.getItemCount()
        
        return {
          items: state.items,
          total,
          itemCount
        }
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'walnut-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

