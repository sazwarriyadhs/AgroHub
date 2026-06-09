import { getCart, clearCart } from './cart'

export async function syncCartToServer() {
  const cart = getCart()
  if (!cart.length) return

  try {
    await fetch(${process.env.NEXT_PUBLIC_API_URL}/cart/sync, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cart }),
    })

    clearCart()
  } catch (err) {
    console.error('Sync cart gagal', err)
  }
}
