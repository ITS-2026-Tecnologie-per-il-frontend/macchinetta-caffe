import { useEffect, useState } from 'react'
import { getDrinks, getMachine, makeCoffee, resetMachine } from './api.js'
import { formatPrice } from './format.js'
import MachineStatus from './components/MachineStatus.jsx'
import DrinkCard from './components/DrinkCard.jsx'
import PreparationModal from './components/PreparationModal.jsx'
import './App.css'

// Ogni quanto chiediamo al server lo stato aggiornato.
// Serve perché la macchinetta è condivisa: un collega può usarla da un altro PC.
const REFRESH_INTERVAL_MS = 2000

function App() {
  const [machine, setMachine] = useState(null)
  const [drinks, setDrinks] = useState([])
  const [isOffline, setIsOffline] = useState(false)
  // { type: 'success' | 'error', text: '...' } oppure null
  const [message, setMessage] = useState(null)
  // La bevanda che stiamo ordinando noi: { drink, status: 'preparing' | 'done', text } oppure null.
  // Quando non è null, il pop-up è aperto.
  const [preparation, setPreparation] = useState(null)

  async function refresh() {
    try {
      const [machineData, drinksData] = await Promise.all([getMachine(), getDrinks()])
      setMachine(machineData)
      setDrinks(drinksData)
      setIsOffline(false)
    } catch {
      setIsOffline(true)
    }
  }

  useEffect(() => {
    // Il linter vede un setState dentro refresh(), ma avviene dopo un await (cioè quando
    // arriva la risposta del server): è il caso legittimo "sincronizzarsi con un sistema esterno".
    // oxlint-disable-next-line react/set-state-in-effect
    refresh()
    const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS)

    // Funzione di "cleanup": React la chiama quando il componente sparisce,
    // così il timer non continua a girare per sempre.
    return () => clearInterval(intervalId)
  }, [])

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
      refresh()
    }
  }

  async function handleReset() {
    try {
      const data = await resetMachine()
      setMessage({ type: 'success', text: data.message })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
    refresh()
  }

  // La macchina è occupata se sta preparando la NOSTRA bevanda
  // oppure se il server dice che sta preparando quella di qualcun altro.
  const isBusy = preparation?.status === 'preparing' || machine?.status === 'preparing'

  return (
    <main className="app">
      <header>
        <h1>☕ Macchinetta del caffè</h1>
        <p className="subtitle">Distributore automatico dell'ufficio</p>
      </header>

      {isOffline && (
        <p className="message error">
          Impossibile contattare la macchinetta. Il server API è acceso? (npm run dev nella
          cartella principale)
        </p>
      )}

      {machine === null ? (
        !isOffline && <p className="loading">Accensione della macchinetta...</p>
      ) : (
        <>
          <MachineStatus machine={machine} isBusy={isBusy} />

          <section className="panel">
            <h2>Scegli la bevanda</h2>
            <div className="drinks">
              {drinks.map((drink) => (
                <DrinkCard key={drink.id} drink={drink} isBusy={isBusy} onOrder={handleOrder} />
              ))}
            </div>
          </section>

          {message && <p className={`message ${message.type}`}>{message.text}</p>}

          <button className="reset" onClick={handleReset} disabled={isBusy}>
            🔧 Ricarica la macchinetta (reset)
          </button>
        </>
      )}

      {preparation && (
        <PreparationModal preparation={preparation} onClose={() => setPreparation(null)} />
      )}
    </main>
  )
}

export default App
