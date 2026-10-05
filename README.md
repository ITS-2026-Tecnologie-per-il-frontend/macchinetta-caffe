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

## Endpoint

### GET /api/machine

Restituisce lo stato e le risorse della macchina.

### GET /api/drinks

Restituisce tutte le bevande disponibili.

### GET /api/stats

Restituisce statistiche e livelli delle risorse.

### POST /api/coffee

Prepara una bevanda.

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
