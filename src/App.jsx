import { useState } from 'react'
import ColorPicker from './components/ColorPicker/ColorPicker'
import Canvas from './components/Canvas/Canvas'
import './App.css'

function App() {
  const [selectedColor, setSelectedColor] = useState('#3b82f6')

  return (
    <div className="app">
      <aside className="sidebar">
        <ColorPicker 
          color={selectedColor}
          onChange={setSelectedColor}
        />
      </aside>
      <main className="main">
        <Canvas color={selectedColor} />
      </main>
    </div>
  )
}

export default App