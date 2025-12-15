import { useState, useRef, useEffect, useCallback } from 'react'
import './ColorPicker.css'

const ColorPicker = ({ color, onChange }) => {
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(100)
  const [brightness, setBrightness] = useState(95)
  const [alpha, setAlpha] = useState(100)
  
  const pickerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // Convert HSB to hex
  const hsbToHex = (h, s, b, a) => {
    s = s / 100
    b = b / 100
    const k = (n) => (n + h / 60) % 6
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
    const r = Math.round(255 * f(5))
    const g = Math.round(255 * f(3))
    const bl = Math.round(255 * f(1))
    
    if (a === 100) {
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
    }
    return `rgba(${r}, ${g}, ${bl}, ${a / 100})`
  }

  // Update parent when values change
  useEffect(() => {
    onChange(hsbToHex(hue, saturation, brightness, alpha))
  }, [hue, saturation, brightness, alpha, onChange])

  const handlePickerInteraction = (e) => {
    const rect = pickerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    
    setSaturation(Math.round((x / rect.width) * 100))
    setBrightness(Math.round((1 - y / rect.height) * 100))
  }

  const handlePickerMouseDown = (e) => {
    setIsDragging(true)
    handlePickerInteraction(e)
  }

  const handlePickerMouseMove = useCallback((e) => {
    if (isDragging) {
      handlePickerInteraction(e)
    }
  }, [isDragging])

  const handlePickerMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePickerMouseMove)
      window.addEventListener('mouseup', handlePickerMouseUp)
      return () => {
        window.removeEventListener('mousemove', handlePickerMouseMove)
        window.removeEventListener('mouseup', handlePickerMouseUp)
      }
    }
  }, [isDragging, handlePickerMouseMove, handlePickerMouseUp])

  const pickerGradientStyle = {
    background: `
      linear-gradient(to top, #000, transparent),
      linear-gradient(to right, #fff, transparent),
      hsl(${hue}, 100%, 50%)
    `
  }

  const hueGradientStyle = {
    background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
  }

  const alphaGradientStyle = {
    background: `linear-gradient(to right, transparent, ${hsbToHex(hue, saturation, brightness, 100)})`
  }

  const cursorStyle = {
    left: `${saturation}%`,
    top: `${100 - brightness}%`
  }

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

        {/* Saturation/Brightness picker */}
        <div className="color-controls">
          <div 
            ref={pickerRef}
            className="sb-picker"
            style={pickerGradientStyle}
            onMouseDown={handlePickerMouseDown}
          >
            <div 
              className="sb-picker__cursor"
              style={cursorStyle}
            />
          </div>

          {/* Hue slider */}
          <div className="slider-group">
            <label className="slider-label">Hue</label>
            <div className="slider-container">
              <div className="slider-track" style={hueGradientStyle}>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="slider"
                />
              </div>
            </div>
          </div>

          {/* Alpha slider */}
          <div className="slider-group">
            <label className="slider-label">Opacity</label>
            <div className="slider-container">
              <div className="slider-track checkerboard">
                <div className="slider-gradient" style={alphaGradientStyle} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                  className="slider"
                />
              </div>
              <span className="slider-value">{alpha}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker