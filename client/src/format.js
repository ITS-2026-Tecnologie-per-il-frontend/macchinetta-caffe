const priceFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

// 1.5 -> "1,50 €"
export function formatPrice(price) {
  return priceFormatter.format(price)
}
