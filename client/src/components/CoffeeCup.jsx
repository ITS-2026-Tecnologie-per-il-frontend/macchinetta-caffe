// La "ricetta visiva" di ogni bevanda: dimensione della tazza e strati di liquido
// dal basso verso l'alto. height è la percentuale di tazza occupata dallo strato.
const RECIPES = {
  espresso: {
    size: 'small',
    layers: [{ color: 'var(--liquid-coffee)', height: 55 }],
  },
  americano: {
    size: 'large',
    layers: [{ color: 'var(--liquid-americano)', height: 85 }],
  },
  cappuccino: {
    size: 'large',
    layers: [
      { color: 'var(--liquid-coffee)', height: 30 },
      { color: 'var(--liquid-milk)', height: 35 },
      { color: 'var(--liquid-foam)', height: 20 },
    ],
  },
  macchiato: {
    size: 'small',
    layers: [
      { color: 'var(--liquid-coffee)', height: 50 },
      { color: 'var(--liquid-foam)', height: 20 },
    ],
  },
}

function CoffeeCup({ drinkId, duration }) {
  const recipe = RECIPES[drinkId] ?? RECIPES.espresso
  const totalHeight = recipe.layers.reduce((sum, layer) => sum + layer.height, 0)

  // Gli strati si riempiono uno dopo l'altro: ognuno parte quando finisce il precedente.
  // Il tempo totale (duration) è diviso in proporzione all'altezza di ogni strato.
  const layers = recipe.layers.map((layer, index) => {
    // Quanta tazza è già occupata dagli strati sotto a questo.
    const filledBelow = recipe.layers
      .slice(0, index)
      .reduce((sum, below) => sum + below.height, 0)

    return {
      bottom: `${filledBelow}%`,
      height: `${layer.height}%`,
      background: layer.color,
      animationDelay: `${(filledBelow / totalHeight) * duration}ms`,
      animationDuration: `${(layer.height / totalHeight) * duration}ms`,
    }
  })

  return (
    <div className={`cup ${recipe.size}`} aria-hidden="true">
      <div className="steam">
        <span />
        <span />
        <span />
      </div>
      <div className="cup-row">
        <div className="cup-body">
          {layers.map((style, index) => (
            <div key={index} className="cup-layer" style={style} />
          ))}
        </div>
        <div className="cup-handle" />
      </div>
      <div className="saucer" />
    </div>
  )
}

export default CoffeeCup
