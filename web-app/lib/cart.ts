export const addToCart = (product: any) => {
  if (typeof window === 'undefined') return

  const existing = localStorage.getItem('guest_cart')
  let cart = existing ? JSON.parse(existing) : []

  const index = cart.findIndex((i: any) => i.id === product.id)

  if (index >= 0) {
    cart[index].qty += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    })
  }

  localStorage.setItem('guest_cart', JSON.stringify(cart))
}