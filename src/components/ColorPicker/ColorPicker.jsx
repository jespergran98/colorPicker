import { useState, useRef, useEffect } from 'react'
import './ColorPicker.css'

const ColorPicker = ({ color, onChange }) => {
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(60)
  const [alpha, setAlpha] = useState(100)
  const [recentColors, setRecentColors] = useState([])
  
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

  // Get current color in hex format
  const getCurrentHexColor = () => {
    const [r, g, b] = hslToRgb(hue, saturation, lightness)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  // Get current color with alpha
  const getCurrentColor = () => {
    const [r, g, b] = hslToRgb(hue, saturation, lightness)
    if (alpha === 100) {
      return getCurrentHexColor()
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
  }

  // Add color to recent colors
  const addToRecentColors = () => {
    const hexColor = getCurrentHexColor()
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== hexColor)
      const updated = [hexColor, ...filtered].slice(0, 12)
      return updated
    })
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
    
    // x-axis: left (0%) = white, right (100%) = full saturation
    // y-axis: top (0%) = pure color, bottom (100%) = black
    const newSaturation = Math.round((x / rect.width) * 100)
    const brightness = 1 - (y / rect.height) // 1 at top, 0 at bottom
    
    // Convert saturation + brightness to HSL lightness
    // At top: lightness should be 50% (pure color)
    // At bottom: lightness should be 0% (black)
    // Left side adds white (increases lightness toward 100%)
    const newLightness = Math.round(brightness * 50 + (1 - newSaturation / 100) * brightness * 50)
    
    setSaturation(newSaturation)
    setLightness(newLightness)
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
      if (isDragging) {
        addToRecentColors()
      }
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

  const handleRecentColorClick = (recentColor) => {
    // Parse hex color back to HSL
    const r = parseInt(recentColor.slice(1, 3), 16) / 255
    const g = parseInt(recentColor.slice(3, 5), 16) / 255
    const b = parseInt(recentColor.slice(5, 7), 16) / 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    
    setHue(Math.round(h * 360))
    setSaturation(Math.round(s * 100))
    setLightness(Math.round(l * 100))
  }

  const pickerGradientStyle = {
    background: `
      linear-gradient(to bottom, transparent, #000),
      linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
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
    top: `${((50 - lightness) / 50) * 100}%`
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
        <div className="slider-container">
          <div className="slider-track">
            <div className="slider-gradient" style={hueGradientStyle} />
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              onMouseUp={addToRecentColors}
              className="slider"
            />
            <div className="slider-handle" style={hueHandleStyle} />
          </div>
        </div>
      </div>

      {/* Alpha slider */}
      <div className="slider-group">
        <div className="slider-container">
          <div className="slider-track checkerboard">
            <div className="slider-gradient" style={alphaGradientStyle} />
            <input
              type="range"
              min="0"
              max="100"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              onMouseUp={addToRecentColors}
              className="slider"
            />
            <div className="slider-handle" style={alphaHandleStyle} />
          </div>
        </div>
      </div>

      {/* Color preview with hex code */}
      <div className="color-preview">
        <div 
          className="color-preview__swatch"
          style={{ backgroundColor: color }}
        />
        <div className="color-preview__hex">{getCurrentHexColor()}</div>
      </div>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="recent-colors">
          {recentColors.map((recentColor, index) => (
            <div
              key={index}
              className="recent-color-swatch"
              style={{ backgroundColor: recentColor }}
              onClick={() => handleRecentColorClick(recentColor)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorPicker