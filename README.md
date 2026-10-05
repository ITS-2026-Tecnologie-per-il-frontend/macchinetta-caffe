# ☕ Coffee Machine API

Una semplice API REST realizzata con Node.js ed Express per simulare una macchinetta del caffe.

## Requisiti

- Node.js installato
- npm

## Installazione

Apri il terminale nella cartella del progetto:

```bash
npm install
```

## Avvio

Modalita normale:

```bash
npm start
```

Modalita sviluppo:

```bash
npm run dev
```

L'API sara disponibile su:

http://localhost:3000

## Frontend React

Il frontend (React + Vite) si trova nella cartella `client/`. Servono **due terminali**: uno per l'API e uno per il frontend.

Terminale 1, nella cartella principale (API):

```bash
npm run dev
```

Terminale 2, nella cartella `client/` (la prima volta esegui anche `npm install`):

```bash
npm run dev
```

Il frontend sarà disponibile su http://localhost:5173. Le chiamate a `/api/...` vengono girate all'API sulla porta 3000 dal proxy configurato in `client/vite.config.js`.

Struttura del frontend:

- `src/api.js`: tutte le chiamate al backend
- `src/App.jsx`: stato dell'applicazione e aggiornamento automatico ogni 2 secondi
- `src/components/MachineStatus.jsx`: stato della macchina e livelli delle risorse
- `src/components/ResourceBar.jsx`: una barra di livello (acqua, caffè, latte)
- `src/components/DrinkCard.jsx`: una bevanda con prezzo, disponibilità e pulsante
- `src/components/PreparationModal.jsx`: pop-up con progress bar mostrato durante la preparazione
- `src/components/CoffeeCup.jsx`: tazza animata che si riempie in modo diverso per ogni bevanda

## Endpoint

### GET /api/machine

Restituisce lo stato e le risorse della macchina.

### GET /api/drinks

Restituisce tutte le bevande. Ogni bevanda ha:

- `available`: quante se ne possono ancora preparare con le risorse attuali (`0` = prodotto non disponibile)
- `preparationTime`: durata della preparazione in millisecondi (usata dal frontend per la progress bar)

### GET /api/stats

Restituisce statistiche e livelli delle risorse.

### POST /api/coffee

Prepara una bevanda. La preparazione dura `preparationTime` millisecondi (da 2 a 4,5 secondi a seconda della bevanda): durante l'attesa lo stato della macchina è `"preparing"` e la risposta arriva solo a bevanda pronta. Se la macchina è già occupata risponde `409`.

Body:

```json
{
  "drink": "espresso"
}
```

Bevande disponibili:

- espresso
- americano
- cappuccino
- macchiato

### POST /api/reset

Riporta la macchina ai valori iniziali.

## Esempio React

```javascript
fetch("http://localhost:3000/api/drinks")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

Per preparare un caffe:

```javascript
fetch("http://localhost:3000/api/coffee", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    drink: "cappuccino"
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```
