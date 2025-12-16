# Color Picker

A modern, responsive color picker application built with React and Vite. Features an intuitive interface for selecting colors with real-time drawing capabilities.

## Features

- **Interactive Color Selection**: 2D saturation/brightness picker with hue and alpha sliders
- **Real-time Drawing**: Canvas for testing colors as you pick them
- **Recent Colors**: Automatically saves your last 17 colors for quick access
- **Fully Responsive**: Optimized layouts for desktop, tablet, and mobile devices
- **Touch Support**: Full touch event handling for mobile devices
- **Modern UI**: Dark theme with smooth animations and clean design

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS custom properties
- **ESLint** - Code linting

## Project Structure

```
COLORPICKER
├── src/
│   ├── components/
│   │   ├── ColorPicker/
│   │   │   ├── ColorPicker.jsx         # Main orchestrator component
│   │   │   ├── ColorPickerArea.jsx     # 2D saturation/brightness picker
│   │   │   ├── HueSlider.jsx          # Hue selection slider
│   │   │   ├── AlphaSlider.jsx        # Alpha/opacity slider
│   │   │   ├── ColorPreview.jsx       # Color preview and hex display
│   │   │   ├── RecentColors.jsx       # Recent colors grid
│   │   │   └── *.css                  # Component styles
│   │   └── Canvas/
│   │       ├── Canvas.jsx             # Drawing canvas
│   │       └── Canvas.css
│   ├── App.jsx                        # Root component
│   ├── App.css                        # App layout styles
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles and CSS variables
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd colorPicker
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Component Architecture

The application follows modern React best practices with component separation:

### ColorPicker Components

- **ColorPickerArea**: Handles 2D color space navigation (saturation/brightness)
- **HueSlider**: Controls hue selection (0-360°)
- **AlphaSlider**: Manages opacity/transparency (0-100%)
- **ColorPreview**: Displays current color with hex code
- **RecentColors**: Shows recently used colors in a 6-5-6 grid layout

### Canvas Component

- Real-time drawing with selected colors
- Supports both mouse and touch input
- Auto-resizes to container

## Responsive Design

The application adapts to different screen sizes:

- **Desktop (> 768px)**: Side-by-side layout with sidebar and canvas
- **Tablet/Mobile (< 768px)**: Stacked layout with 50/50 viewport split
- **Small Mobile (< 480px)**: Optimized padding and sizing

## Color Format

- **Output**: RGB hex format (`#RRGGBB`) or RGBA (`rgba(r, g, b, a)`)
- **Recent Colors**: Stored as hex values
- **Internal**: HSB (Hue, Saturation, Brightness) color model

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with touch support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI framework: [React](https://react.dev/)
- Color space conversions based on HSB color model
