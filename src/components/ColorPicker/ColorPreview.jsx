import './ColorPreview.css'

const ColorPreview = ({ color, hexColor }) => {
  return (
    <div className="color-preview">
      <div className="color-swatch" style={{ background: color }} />
      <div className="color-hex">{hexColor}</div>
    </div>
  )
}

export default ColorPreview