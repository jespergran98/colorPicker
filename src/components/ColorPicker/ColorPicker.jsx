import { useState, useEffect, useCallback } from 'react'
import ColorPickerArea from './ColorPickerArea'
import HueSlider from './HueSlider'
import AlphaSlider from './AlphaSlider'
import ColorPreview from './ColorPreview'
import RecentColors from './RecentColors'
import './ColorPicker.css'

const ColorPicker = ({ color, onChange }) => {
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(100)
  const [brightness, setBrightness] = useState(100)
  const [alpha, setAlpha] = useState(100)
  const [recentColors, setRecentColors] = useState([])

  const hsbToRgb = (h, s, b) => {
    s /= 100
    b /= 100
    const k = (n) => (n + h / 60) % 6
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
    return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))]
  }

  const rgbToHex = (r, g, b) => 
    `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`

  const getCurrentColor = useCallback(() => {
    const [r, g, b] = hsbToRgb(hue, saturation, brightness)
    return alpha === 100 ? rgbToHex(r, g, b) : `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
  }, [hue, saturation, brightness, alpha])

  const addToRecent = useCallback(() => {
    const [r, g, b] = hsbToRgb(hue, saturation, brightness)
    const hex = rgbToHex(r, g, b)
    setRecentColors(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 17))
  }, [hue, saturation, brightness])

  useEffect(() => {
    onChange(getCurrentColor())
  }, [getCurrentColor, onChange])

  const handlePickerChange = ({ saturation: newSat, brightness: newBright }) => {
    setSaturation(newSat)
    setBrightness(newBright)
  }

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

  const [r, g, b] = hsbToRgb(hue, saturation, brightness)
  const hexColor = rgbToHex(r, g, b)

  return (
    <div className="color-picker">
      <ColorPickerArea
        hue={hue}
        saturation={saturation}
        brightness={brightness}
        onChange={handlePickerChange}
        onChangeComplete={addToRecent}
      />

      <HueSlider
        value={hue}
        onChange={setHue}
        onChangeComplete={addToRecent}
      />

      <AlphaSlider
        value={alpha}
        color={getCurrentColor()}
        onChange={setAlpha}
        onChangeComplete={addToRecent}
      />

      <ColorPreview
        color={color}
        hexColor={hexColor}
      />

      <RecentColors
        colors={recentColors}
        onSelect={loadRecentColor}
      />
    </div>
  )
}

export default ColorPicker