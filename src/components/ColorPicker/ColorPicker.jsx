import { useState, useRef, useEffect } from 'react'
import './ColorPicker.css'

const ColorPicker = ({ color, onChange }) => {
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(100)
  const [brightness, setBrightness] = useState(100)
  const [alpha, setAlpha] = useState(100)
  const [recentColors, setRecentColors] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const pickerRef = useRef(null)

  const hsbToRgb = (h, s, b) => {
    s /= 100
    b /= 100
    const k = (n) => (n + h / 60) % 6
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
    return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))]
  }

  const rgbToHex = (r, g, b) => 
    `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`

  const getCurrentColor = () => {
    const [r, g, b] = hsbToRgb(hue, saturation, brightness)
    return alpha === 100 ? rgbToHex(r, g, b) : `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
  }

  const addToRecent = () => {
    const [r, g, b] = hsbToRgb(hue, saturation, brightness)
    const hex = rgbToHex(r, g, b)
    setRecentColors(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 12))
  }

  useEffect(() => {
    onChange(getCurrentColor())
  }, [hue, saturation, brightness, alpha])

  const updatePicker = (e) => {
    if (!pickerRef.current) return
    const rect = pickerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    
    setSaturation(Math.round((x / rect.width) * 100))
    setBrightness(Math.round((1 - y / rect.height) * 100))
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    updatePicker(e)
  }

  useEffect(() => {
    if (!isDragging) return
    
    const handleMove = (e) => updatePicker(e)
    const handleUp = () => {
      setIsDragging(false)
      addToRecent()
    }
    
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isDragging])

  const loadRecentColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    
    let h = 0, s = 0
    if (delta !== 0) {
      s = max === 0 ? 0 : (delta / max) * 100
      if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) * 60
      else if (max === g) h = ((b - r) / delta + 2) * 60
      else h = ((r - g) / delta + 4) * 60
    }
    
    setHue(Math.round(h))
    setSaturation(Math.round(s))
    setBrightness(Math.round(max * 100))
  }

  return (
    <div className="color-picker">
      <div 
        ref={pickerRef}
        className="picker"
        style={{
          background: `linear-gradient(to bottom, transparent, #000),
                       linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
        }}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="cursor"
          style={{
            left: `${saturation}%`,
            top: `${100 - brightness}%`
          }}
        />
      </div>

      <div className="slider-container">
        <div className="slider-track" style={{
          background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
        }}>
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            onMouseUp={addToRecent}
          />
          <div className="handle" style={{
            left: `${(hue / 360) * 100}%`,
            background: `hsl(${hue}, 100%, 50%)`
          }} />
        </div>
      </div>

      <div className="slider-container">
        <div className="slider-track checkerboard" style={{
          background: `url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%232a2a2a'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%232a2a2a'/%3E%3C/svg%3E"),
                       linear-gradient(to right, transparent, ${getCurrentColor().replace(/[\d.]+\)$/, '1)')})`
        }}>
          <input
            type="range"
            min="0"
            max="100"
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            onMouseUp={addToRecent}
          />
          <div className="handle" style={{
            left: `${alpha}%`,
            background: color
          }} />
        </div>
      </div>

      <div className="preview">
        <div className="swatch" style={{ background: color }} />
        <div className="hex">{rgbToHex(...hsbToRgb(hue, saturation, brightness))}</div>
      </div>

      {recentColors.length > 0 && (
        <div className="recent">
          {recentColors.map((c, i) => (
            <div
              key={i}
              className="recent-swatch"
              style={{ background: c }}
              onClick={() => loadRecentColor(c)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorPicker