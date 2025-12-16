import './RecentColors.css'

const RecentColors = ({ colors, onSelect }) => {
  if (colors.length === 0) return null

  const renderRows = () => {
    const rows = []
    
    if (colors.length > 0) {
      rows.push(
        <div key="row-0" className="recent-row">
          {colors.slice(0, 6).map((c, i) => (
            <div
              key={i}
              className="recent-swatch"
              style={{ background: c }}
              onClick={() => onSelect(c)}
            />
          ))}
        </div>
      )
    }
    
    if (colors.length > 6) {
      rows.push(
        <div key="row-1" className="recent-row">
          {colors.slice(6, 11).map((c, i) => (
            <div
              key={i + 6}
              className="recent-swatch"
              style={{ background: c }}
              onClick={() => onSelect(c)}
            />
          ))}
        </div>
      )
    }
    
    if (colors.length > 11) {
      rows.push(
        <div key="row-2" className="recent-row">
          {colors.slice(11, 17).map((c, i) => (
            <div
              key={i + 11}
              className="recent-swatch"
              style={{ background: c }}
              onClick={() => onSelect(c)}
            />
          ))}
        </div>
      )
    }
    
    return rows
  }

  return (
    <div className="recent-colors">
      {renderRows()}
    </div>
  )
}

export default RecentColors