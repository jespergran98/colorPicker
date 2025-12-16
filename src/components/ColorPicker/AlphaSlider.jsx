import './AlphaSlider.css'

const AlphaSlider = ({ value, color, onChange, onChangeComplete }) => {
  return (
    <div className="slider-container">
      <div 
        className="slider-track alpha-track"
        style={{
          backgroundImage: `
            linear-gradient(to right, transparent, ${color.replace(/[\d.]+\)$/, '1)')}),
            linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
            linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
            linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
          `,
          backgroundSize: '100% 100%, 12px 12px, 12px 12px, 12px 12px, 12px 12px',
          backgroundPosition: '0 0, 0 0, 0 6px, 6px -6px, -6px 0px',
          backgroundColor: '#151515'
        }}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseUp={onChangeComplete}
          onTouchEnd={onChangeComplete}
        />
        <div 
          className="slider-handle" 
          style={{
            left: `${value}%`,
            background: color
          }} 
        />
      </div>
    </div>
  )
}

export default AlphaSlider