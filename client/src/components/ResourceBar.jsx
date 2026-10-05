// Sotto questa percentuale la barra diventa rossa.
const LOW_LEVEL = 25

function ResourceBar({ icon, label, value, max }) {
  const percent = Math.round((value / max) * 100)
  const isLow = percent < LOW_LEVEL

  return (
    <div className="resource">
      <div className="resource-label">
        <span>
          {icon} {label}
        </span>
        <span className={isLow ? 'resource-value low' : 'resource-value'}>{percent}%</span>
      </div>
      <div className="resource-track">
        <div
          className={isLow ? 'resource-fill low' : 'resource-fill'}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ResourceBar
