import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router'
import { getDrinks, getMachine } from './api.js'
import HomePage from './pages/HomePage.jsx'
import IngredientsPage from './pages/IngredientsPage.jsx'
import './App.css'

// Ogni quanto chiediamo al server lo stato aggiornato.
// Serve perché la macchinetta è condivisa: un collega può usarla da un altro PC.
const REFRESH_INTERVAL_MS = 2000

// App è il "guscio" comune a tutte le pagine: intestazione, menu e dati della macchina.
// I dati stanno qui (e non nelle pagine) perché servono a entrambe le pagine.
function App() {
  const [machine, setMachine] = useState(null)
  const [drinks, setDrinks] = useState([])
  const [isOffline, setIsOffline] = useState(false)

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

  return (
    <main className="app">
      <header>
        <h1>☕ Macchinetta del caffè</h1>
        <p className="subtitle">Distributore automatico dell'ufficio</p>

        {/* NavLink è un Link che aggiunge da solo la classe "active" alla pagina corrente. */}
        <nav className="nav">
          <NavLink to="/" end>
            ☕ Bevande
          </NavLink>
          <NavLink to="/ingredienti">🫘 Ingredienti</NavLink>
        </nav>
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
        // Routes guarda l'URL e mostra solo la Route il cui path corrisponde.
        <Routes>
          <Route
            path="/"
            element={<HomePage machine={machine} drinks={drinks} onChange={refresh} />}
          />
          <Route
            path="/ingredienti"
            element={<IngredientsPage machine={machine} onChange={refresh} />}
          />
          <Route
            path="*"
            element={
              <p className="loading">
                Pagina non trovata. <Link to="/">Torna alle bevande</Link>
              </p>
            }
          />
        </Routes>
      )}
    </main>
  )
}

export default App
