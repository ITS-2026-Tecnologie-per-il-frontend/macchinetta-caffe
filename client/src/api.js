// Tutte le chiamate al backend stanno qui: i componenti non usano mai fetch direttamente.

async function request(path, options) {
  const response = await fetch(path, options)
  const data = await response.json()

  // fetch NON lancia errori per le risposte 4xx/5xx: il controllo va fatto a mano.
  if (!data.success) {
    throw new Error(data.error)
  }

  return data
}

export async function getMachine() {
  const data = await request('/api/machine')
  return data.machine
}

export async function getDrinks() {
  const data = await request('/api/drinks')
  return data.drinks
}

export async function makeCoffee(drinkId) {
  return request('/api/coffee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drink: drinkId }),
  })
}

export async function resetMachine() {
  return request('/api/reset', { method: 'POST' })
}
