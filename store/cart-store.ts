import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variantSku?: string
  selectedColor?: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string, variantSku?: string) => void
  updateQuantity: (id: string, quantity: number, variantSku?: string) => void
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
          // Check for existing item with same ID and variant
          const existingItem = state.items.find(i => 
            i.id === item.id && 
            i.variantSku === item.variantSku
          )
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id && i.variantSku === item.variantSku
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
      
      removeFromCart: (id, variantSku?: string) => {
        set((state) => ({
          items: state.items.filter(item => 
            variantSku 
              ? !(item.id === id && item.variantSku === variantSku)
              : item.id !== id
          )
        }))
      },
      
      updateQuantity: (id, quantity, variantSku?: string) => {
        if (quantity <= 0) {
          get().removeFromCart(id, variantSku)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            variantSku 
              ? (item.id === id && item.variantSku === variantSku)
                ? { ...item, quantity }
                : item
              : item.id === id
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
