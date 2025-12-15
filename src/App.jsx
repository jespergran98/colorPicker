import { useState } from 'react'
import ColorPicker from './components/ColorPicker/ColorPicker'
import Canvas from './components/Canvas/Canvas'
import './App.css'

function App() {
  const [color, setColor] = useState('#3b82f6')

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Color Picker</h1>
          <p className="sidebar-subtitle">Pick a color and start drawing</p>
        </div>
        <div className="sidebar-content">
          <ColorPicker color={color} onChange={setColor} />
        </div>
      </aside>
      <main className="main">
        <Canvas color={color} />
      </main>
    </div>
  )
}

export default App