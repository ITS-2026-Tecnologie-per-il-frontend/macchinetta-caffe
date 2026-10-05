import { formatPrice } from '../format.js'

const DRINK_ICONS = {
  espresso: '☕',
  americano: '🫖',
  cappuccino: '🥛',
  macchiato: '🍮',
}

function DrinkCard({ drink, isBusy, onOrder }) {
  const isAvailable = drink.available > 0

  return (
    <article className={isAvailable ? 'drink' : 'drink unavailable'}>
      <span className="drink-icon">{DRINK_ICONS[drink.id] ?? '☕'}</span>
      <h3>{drink.name}</h3>
      <p className="drink-price">{formatPrice(drink.price)}</p>

      {isAvailable ? (
        <p className="drink-available">Disponibili: {drink.available}</p>
      ) : (
        <p className="drink-available warning">⚠️ Prodotto non disponibile</p>
      )}

      <button onClick={() => onOrder(drink)} disabled={!isAvailable || isBusy}>
        Prepara
      </button>
    </article>
  )
}

export default DrinkCard
