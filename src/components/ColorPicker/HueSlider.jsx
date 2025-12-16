import './HueSlider.css'

const HueSlider = ({ value, onChange, onChangeComplete }) => {
  return (
    <div className="slider-container">
      <div className="slider-track hue-track">
        <input
          type="range"
          min="0"
          max="360"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseUp={onChangeComplete}
          onTouchEnd={onChangeComplete}
        />
        <div 
          className="slider-handle" 
          style={{
            left: `${(value / 360) * 100}%`,
            background: `hsl(${value}, 100%, 50%)`
          }} 
        />
      </div>
    </div>
  )
}

export default HueSlider