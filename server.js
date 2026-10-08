const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const initialMachine = {
  water: 100,
  coffee: 100,
  milk: 100,
  status: "ready",
  totalCoffees: 0
};

const machine = { ...initialMachine };

// Gli ingredienti ricaricabili, con il nome da usare nei messaggi.
const INGREDIENT_NAMES = {
  water: "acqua",
  coffee: "caffè",
  milk: "latte"
};

// preparationTime: durata dell'erogazione in millisecondi (il cappuccino deve montare il latte).
const drinks = [
  {
    id: "espresso",
    name: "Espresso",
    price: 1.0,
    preparationTime: 2000,
    requirements: { water: 10, coffee: 12, milk: 0 }
  },
  {
    id: "americano",
    name: "Americano",
    price: 1.2,
    preparationTime: 3000,
    requirements: { water: 20, coffee: 12, milk: 0 }
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    price: 1.5,
    preparationTime: 4500,
    requirements: { water: 10, coffee: 12, milk: 20 }
  },
  {
    id: "macchiato",
    name: "Macchiato",
    price: 1.3,
    preparationTime: 3000,
    requirements: { water: 10, coffee: 12, milk: 8 }
  }
];

// Quante bevande di questo tipo si possono ancora preparare con le risorse attuali.
// Il limite è dato dalla risorsa che finisce per prima (es. il latte per il cappuccino).
function countAvailable(drink) {
  const counts = Object.entries(drink.requirements)
    .filter(([, amount]) => amount > 0)
    .map(([resource, amount]) => Math.floor(machine[resource] / amount));

  return Math.min(...counts);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/", (req, res) => {
  res.json({
    name: "Coffee Machine API",
    version: "1.0.0",
    message: "API della macchinetta del caffe attiva!",
    endpoints: [
      "GET /api/machine",
      "GET /api/drinks",
      "GET /api/stats",
      "POST /api/coffee",
      "POST /api/refill",
      "POST /api/reset"
    ]
  });
});

app.get("/api/machine", (req, res) => {
  res.json({
    success: true,
    machine
  });
});

app.get("/api/drinks", (req, res) => {
  res.json({
    success: true,
    drinks: drinks.map((drink) => ({
      ...drink,
      available: countAvailable(drink)
    }))
  });
});

app.get("/api/stats", (req, res) => {
  res.json({
    success: true,
    stats: {
      totalCoffees: machine.totalCoffees,
      water: machine.water,
      coffee: machine.coffee,
      milk: machine.milk
    }
  });
});

app.post("/api/coffee", async (req, res) => {
  const { drink } = req.body;

  if (typeof drink !== "string") {
    return res.status(400).json({
      success: false,
      error: "Devi specificare una bevanda. Esempio: { \"drink\": \"espresso\" }"
    });
  }

  const selectedDrink = drinks.find((item) => item.id === drink.toLowerCase());

  if (!selectedDrink) {
    return res.status(404).json({
      success: false,
      error: "Bevanda non trovata.",
      availableDrinks: drinks.map((item) => item.id)
    });
  }

  if (machine.status === "preparing") {
    return res.status(409).json({
      success: false,
      error: "La macchinetta sta già preparando una bevanda. Riprova tra poco."
    });
  }

  const requirements = selectedDrink.requirements;

  if (machine.water < requirements.water) {
    return res.status(409).json({
      success: false,
      error: "Acqua insufficiente per preparare questa bevanda."
    });
  }

  if (machine.coffee < requirements.coffee) {
    return res.status(409).json({
      success: false,
      error: "Caffe insufficiente per preparare questa bevanda."
    });
  }

  if (machine.milk < requirements.milk) {
    return res.status(409).json({
      success: false,
      error: "Latte insufficiente per preparare questa bevanda."
    });
  }

  machine.status = "preparing";

  machine.water -= requirements.water;
  machine.coffee -= requirements.coffee;
  machine.milk -= requirements.milk;
  machine.totalCoffees += 1;

  // Simula il tempo di erogazione: durante l'attesa GET /api/machine risponde "preparing".
  await wait(selectedDrink.preparationTime);

  machine.status = "ready";

  res.json({
    success: true,
    message: `${selectedDrink.name} preparato con successo!`,
    drink: {
      id: selectedDrink.id,
      name: selectedDrink.name,
      price: selectedDrink.price
    },
    machine: {
      water: machine.water,
      coffee: machine.coffee,
      milk: machine.milk,
      status: machine.status,
      totalCoffees: machine.totalCoffees
    }
  });
});

// Ricarica un ingrediente ({ "ingredient": "milk" }) oppure tutti, se il body è vuoto.
// A differenza del reset, non azzera il contatore delle bevande erogate.
app.post("/api/refill", (req, res) => {
  // Se la richiesta non ha un body JSON, in Express 5 req.body è undefined.
  const { ingredient } = req.body ?? {};

  if (machine.status === "preparing") {
    return res.status(409).json({
      success: false,
      error: "Non si può ricaricare durante la preparazione di una bevanda."
    });
  }

  if (ingredient !== undefined && !Object.keys(INGREDIENT_NAMES).includes(ingredient)) {
    return res.status(400).json({
      success: false,
      error: "Ingrediente non valido.",
      availableIngredients: Object.keys(INGREDIENT_NAMES)
    });
  }

  const toRefill = ingredient ? [ingredient] : Object.keys(INGREDIENT_NAMES);

  // Il valore iniziale coincide con la capienza massima del serbatoio.
  for (const name of toRefill) {
    machine[name] = initialMachine[name];
  }

  res.json({
    success: true,
    message: ingredient
      ? `Ricarica completata: ${INGREDIENT_NAMES[ingredient]}.`
      : "Ricarica completata: tutti gli ingredienti.",
    machine
  });
});

app.post("/api/reset", (req, res) => {
  Object.assign(machine, initialMachine);

  res.json({
    success: true,
    message: "Macchinetta resettata.",
    machine
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint non trovato."
  });
});

app.listen(PORT, () => {
  console.log(`☕ Coffee Machine API avviata su http://localhost:${PORT}`);
});
