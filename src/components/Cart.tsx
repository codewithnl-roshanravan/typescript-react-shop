import { Offcanvas, Stack } from 'react-bootstrap'

import { useCartContext } from '../context/CartContext'

import CartItem from '../components/CartItem'

import productItems from '../data/products.json'

type CartProps = {
  isOpen: boolean
}

function Cart({ isOpen }: CartProps) {
  const { closeCart, cartItems } = useCartContext()

  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className='text-info'>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={5}>
          {cartItems.map((item) => (
            <CartItem  key={item.id} {...item} />
          ))}
          <div className='fw-bold fs-5 text-info'>
            Total:{' '}
            {cartItems.reduce((total, currentItem) => {
              const product = productItems.find(
                (item) => item.id === currentItem.id
              )

              return total + (product?.price || 0) * currentItem.qty
            }, 0)}
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default Cart
