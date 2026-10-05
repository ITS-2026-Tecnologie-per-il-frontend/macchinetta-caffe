import CoffeeCup from './CoffeeCup.jsx'

// preparation = { drink, status: 'preparing' | 'done', text }
function PreparationModal({ preparation, onClose }) {
  const { drink, status, text } = preparation
  const isDone = status === 'done'

  return (
    <div className="overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">
          {isDone ? `✅ ${drink.name} pronto!` : `Preparazione ${drink.name}...`}
        </h2>

        <CoffeeCup drinkId={drink.id} duration={drink.preparationTime} />

        {isDone ? (
          <>
            <p className="modal-text">{text}</p>
            <button onClick={onClose} autoFocus>
              Ritira la bevanda
            </button>
          </>
        ) : (
          <div className="progress" role="progressbar" aria-label="Avanzamento preparazione">
            {/* La barra si riempie con un'animazione CSS lunga quanto la preparazione. */}
            <div
              className="progress-fill"
              style={{ animationDuration: `${drink.preparationTime}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PreparationModal
