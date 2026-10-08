import { useState } from 'react'
import { refillIngredient } from '../api.js'
import ResourceBar from '../components/ResourceBar.jsx'

// I livelli iniziali nel server sono 100, quindi li trattiamo come percentuali.
const MAX_LEVEL = 100

// Elenco degli ingredienti: per aggiungerne uno basta una riga qui (e nel server).
const INGREDIENTS = [
  { id: 'water', icon: '💧', label: 'Acqua' },
  { id: 'coffee', icon: '🫘', label: 'Caffè' },
  { id: 'milk', icon: '🥛', label: 'Latte' },
]

// onChange: funzione di App da chiamare dopo una ricarica, per ricaricare i dati dal server.
function IngredientsPage({ machine, onChange }) {
  // { type: 'success' | 'error', text: '...' } oppure null
  const [message, setMessage] = useState(null)

  const isBusy = machine.status === 'preparing'
  const isAllFull = INGREDIENTS.every((ingredient) => machine[ingredient.id] === MAX_LEVEL)

  // ingredientId undefined = ricarica tutti gli ingredienti.
  async function handleRefill(ingredientId) {
    try {
      const data = await refillIngredient(ingredientId)
      setMessage({ type: 'success', text: data.message })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
    onChange()
  }

  return (
    <>
      <section className="panel">
        <div className="status-row">
          <h2>Livello ingredienti</h2>
          {isBusy && <span className="badge busy">🔥 In preparazione</span>}
        </div>

        {INGREDIENTS.map((ingredient) => (
          <div key={ingredient.id} className="ingredient">
            <ResourceBar
              icon={ingredient.icon}
              label={ingredient.label}
              value={machine[ingredient.id]}
              max={MAX_LEVEL}
            />
            <button
              className="refill"
              onClick={() => handleRefill(ingredient.id)}
              disabled={isBusy || machine[ingredient.id] === MAX_LEVEL}
            >
              Ricarica
            </button>
          </div>
        ))}

        <button onClick={() => handleRefill()} disabled={isBusy || isAllFull}>
          🔄 Ricarica tutto
        </button>

        <p className="total">
          📊 Bevande erogate: <strong>{machine.totalCoffees}</strong>
        </p>
      </section>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}
    </>
  )
}

export default IngredientsPage
