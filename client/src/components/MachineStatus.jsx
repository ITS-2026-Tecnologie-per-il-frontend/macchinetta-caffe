import ResourceBar from './ResourceBar.jsx'

// I livelli iniziali nel server sono 100, quindi li trattiamo come percentuali.
const MAX_LEVEL = 100

function MachineStatus({ machine, isBusy }) {
  return (
    <section className="panel">
      <div className="status-row">
        <h2>Stato macchina</h2>
        <span className={isBusy ? 'badge busy' : 'badge ready'}>
          {isBusy ? '🔥 In preparazione' : '✅ Pronta'}
        </span>
      </div>

      <ResourceBar icon="💧" label="Acqua" value={machine.water} max={MAX_LEVEL} />
      <ResourceBar icon="🫘" label="Caffè" value={machine.coffee} max={MAX_LEVEL} />
      <ResourceBar icon="🥛" label="Latte" value={machine.milk} max={MAX_LEVEL} />

      <p className="total">
        📊 Bevande erogate: <strong>{machine.totalCoffees}</strong>
      </p>
    </section>
  )
}

export default MachineStatus
