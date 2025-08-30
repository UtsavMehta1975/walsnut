import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === item.id)
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            }
          }
          
          return {
            items: [...state.items, { ...item, quantity: 1 }]
          }
        })
      },
      
      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'walnut-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
