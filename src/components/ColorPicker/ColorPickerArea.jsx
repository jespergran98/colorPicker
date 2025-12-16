import { useRef, useEffect, useState, useCallback } from 'react'
import './ColorPickerArea.css'

const ColorPickerArea = ({ hue, saturation, brightness, onChange, onChangeComplete }) => {
  const [isDragging, setIsDragging] = useState(false)
  const pickerRef = useRef(null)

  const updatePicker = useCallback((e) => {
    if (!pickerRef.current) return
    const rect = pickerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    
    const newSaturation = Math.round((x / rect.width) * 100)
    const newBrightness = Math.round((1 - y / rect.height) * 100)
    
    onChange({ saturation: newSaturation, brightness: newBrightness })
  }, [onChange])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    updatePicker(e)
  }

  const handleTouchStart = (e) => {
    setIsDragging(true)
    const touch = e.touches[0]
    updatePicker({ clientX: touch.clientX, clientY: touch.clientY })
  }

  useEffect(() => {
    if (!isDragging) return
    
    const handleMove = (e) => {
      e.preventDefault()
      updatePicker(e)
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      updatePicker({ clientX: touch.clientX, clientY: touch.clientY })
    }
    
    const handleUp = () => {
      setIsDragging(false)
      if (onChangeComplete) onChangeComplete()
    }
    
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [isDragging, updatePicker, onChangeComplete])

  return (
    <div 
      ref={pickerRef}
      className="picker-area"
      style={{
        background: `linear-gradient(to bottom, transparent, #000),
                     linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div 
        className="picker-cursor"
        style={{
          left: `${saturation}%`,
          top: `${100 - brightness}%`
        }}
      />
    </div>
  )
}

export default ColorPickerArea