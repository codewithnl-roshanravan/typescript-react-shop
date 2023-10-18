import { createContext, useContext, useState, ReactNode } from 'react'

import Cart from '../components/Cart'

import { useLocalStroage } from '../hooks/useLocalStorage'

type CartProviderProps = {
  children: ReactNode
}

type CartItem = {
  id: number
  qty: number
}

type CartContext = {
  openCart: () => void
  closeCart: () => void
  getItemQty: (id: number) => number
  addItem: (id: number) => void
  decreaseItem: (id: number) => void
  removeItem: (id: number) => void
  cartQty: number
  cartItems: CartItem[]
}

const CartContext = createContext({} as CartContext)

export function useCartContext() {
  return useContext(CartContext)
}

export function CartProvider({ children }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [cartItems, setCartItems] = useLocalStroage<CartItem[]>(
    'shopping-cart',
    []
  )

  const cartQty = cartItems.reduce((qty, item) => item.qty + qty, 0)

  const openCart = () => setIsOpen(true)

  const closeCart = () => setIsOpen(false)

  function getItemQty(id: number) {
    return cartItems.find((item) => item.id === id)?.qty || 0
  }

  function addItem(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, qty: 1 }]
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, qty: item.qty + 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  function decreaseItem(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.qty == 1) {
        return currItems.filter((item) => item.id !== id)
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, qty: item.qty - 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  function removeItem(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id)
    })
  }

  return (
    <CartContext.Provider
      value={{
        getItemQty,
        addItem,
        decreaseItem,
        removeItem,
        cartQty,
        cartItems,
        openCart,
        closeCart,
      }}
    >
      {children}
      <Cart isOpen={isOpen} />
    </CartContext.Provider>
  )
}
