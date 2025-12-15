import { useState, useRef, useEffect } from 'react'
import './ColorPicker.css'

const ColorPicker = ({ color, onChange }) => {
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(60)
  const [alpha, setAlpha] = useState(100)
  
  const pickerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    s /= 100
    l /= 100
    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))]
  }

  // Get current color in hex or rgba format
  const getCurrentColor = () => {
    const [r, g, b] = hslToRgb(hue, saturation, lightness)
    if (alpha === 100) {
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
  }

  // Update parent when values change
  useEffect(() => {
    onChange(getCurrentColor())
  }, [hue, saturation, lightness, alpha])

  const handlePickerInteraction = (e) => {
    if (!pickerRef.current) return
    const rect = pickerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    
    setSaturation(Math.round((x / rect.width) * 100))
    setLightness(Math.round((1 - y / rect.height) * 100))
  }

  const handlePickerMouseDown = (e) => {
    setIsDragging(true)
    handlePickerInteraction(e)
  }

  useEffect(() => {
    const handleMove = (e) => {
      if (isDragging) {
        handlePickerInteraction(e)
      }
    }
    
    const handleUp = () => {
      setIsDragging(false)
    }
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleUp)
      return () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)
      }
    }
  }, [isDragging])

  const pickerGradientStyle = {
    background: `
      linear-gradient(to top, #000, transparent),
      linear-gradient(to right, #fff, transparent),
      hsl(${hue}, 100%, 50%)
    `
  }

  const hueGradientStyle = {
    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
  }

  const alphaGradientStyle = {
    background: `linear-gradient(to right, transparent, ${getCurrentColor().replace(/[\d.]+\)$/, '1)')})`
  }

  const cursorStyle = {
    left: `${saturation}%`,
    top: `${100 - lightness}%`
  }

  const hueHandleStyle = {
    left: `${(hue / 360) * 100}%`,
    backgroundColor: `hsl(${hue}, 100%, 50%)`
  }

  const alphaHandleStyle = {
    left: `${alpha}%`,
    backgroundColor: color
  }

  return (
    <div className="color-picker">
      {/* Color preview */}
      <div className="color-preview">
        <div className="color-preview__left">
          <div 
            className="color-preview__swatch"
            style={{ backgroundColor: color }}
          />
          <span className="color-preview__label">Current</span>
        </div>
        <span className="color-preview__value">{color}</span>
      </div>

      {/* Saturation/Lightness picker */}
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
          <div className="slider-track">
            <div className="slider-gradient" style={hueGradientStyle} />
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-handle" style={hueHandleStyle} />
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
            <div className="slider-handle" style={alphaHandleStyle} />
          </div>
          <span className="slider-value">{alpha}%</span>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker