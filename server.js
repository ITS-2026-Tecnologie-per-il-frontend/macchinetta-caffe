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

const drinks = [
  {
    id: "espresso",
    name: "Espresso",
    price: 1.0,
    requirements: { water: 10, coffee: 12, milk: 0 }
  },
  {
    id: "americano",
    name: "Americano",
    price: 1.2,
    requirements: { water: 20, coffee: 12, milk: 0 }
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    price: 1.5,
    requirements: { water: 10, coffee: 12, milk: 20 }
  },
  {
    id: "macchiato",
    name: "Macchiato",
    price: 1.3,
    requirements: { water: 10, coffee: 12, milk: 8 }
  }
];

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
    drinks
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

app.post("/api/coffee", (req, res) => {
  const { drink } = req.body;

  if (!drink) {
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
