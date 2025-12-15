import './ColorPicker.css'

const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="color-picker">
      <div className="color-picker__header">
        <h2 className="color-picker__title">Color Picker</h2>
      </div>

      <div className="color-picker__content">
        {/* Color preview */}
        <div className="color-preview">
          <div 
            className="color-preview__swatch"
            style={{ backgroundColor: color }}
          />
          <span className="color-preview__value">{color}</span>
        </div>

        {/* Placeholder for color selection controls */}
        <div className="color-controls">
          {/* Add your HSL/RGB sliders, color wheel, or palette here */}
        </div>
      </div>
    </div>
  )
}

export default ColorPicker