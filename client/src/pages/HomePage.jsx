import { useState } from 'react'
import { Link } from 'react-router'
import { makeCoffee } from '../api.js'
import { formatPrice } from '../format.js'
import DrinkCard from '../components/DrinkCard.jsx'
import PreparationModal from '../components/PreparationModal.jsx'

// onChange: funzione di App da chiamare dopo un ordine, per ricaricare i dati dal server.
function HomePage({ machine, drinks, onChange }) {
  // { type: 'error', text: '...' } oppure null
  const [message, setMessage] = useState(null)
  // La bevanda che stiamo ordinando noi: { drink, status: 'preparing' | 'done', text } oppure null.
  // Quando non è null, il pop-up è aperto.
  const [preparation, setPreparation] = useState(null)

  async function handleOrder(drink) {
    setMessage(null)
    setPreparation({ drink, status: 'preparing' })

    try {
      const data = await makeCoffee(drink.id)
      // Il pop-up resta aperto in stato "pronto" finché l'utente non ritira la bevanda.
      setPreparation({
        drink,
        status: 'done',
        text: `Importo: ${formatPrice(data.drink.price)}`,
      })
    } catch (error) {
      setPreparation(null)
      setMessage({ type: 'error', text: error.message })
    } finally {
      onChange()
    }
  }

  // La macchina è occupata se sta preparando la NOSTRA bevanda
  // oppure se il server dice che sta preparando quella di qualcun altro.
  const isBusy = preparation?.status === 'preparing' || machine.status === 'preparing'
  const hasUnavailable = drinks.some((drink) => drink.available === 0)

  return (
    <>
      <section className="panel">
        <div className="status-row">
          <h2>Scegli la bevanda</h2>
          <span className={isBusy ? 'badge busy' : 'badge ready'}>
            {isBusy ? '🔥 In preparazione' : '✅ Pronta'}
          </span>
        </div>

        <div className="drinks">
          {drinks.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} isBusy={isBusy} onOrder={handleOrder} />
          ))}
        </div>

        {hasUnavailable && (
          <p className="hint">
            Alcuni prodotti sono esauriti. <Link to="/ingredienti">Ricarica gli ingredienti</Link>
          </p>
        )}
      </section>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      {preparation && (
        <PreparationModal preparation={preparation} onClose={() => setPreparation(null)} />
      )}
    </>
  )
}

export default HomePage
