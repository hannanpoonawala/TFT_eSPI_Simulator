# 🖥️ TFT_eSPI Simulator

A browser-based simulator for prototyping TFT display UIs without flashing microcontrollers. This tool allows you to write TFT_eSPI-style code and see the visual output instantly in your browser.

## 🎯 Purpose

When developing UI code for TFT displays using the TFT_eSPI library on microcontrollers, every code change requires:
1. Compiling the firmware
2. Flashing to the microcontroller
3. Waiting for the device to restart
4. Observing the result

This simulator eliminates that cycle by providing instant visual feedback in your browser, significantly speeding up UI development and reducing flash memory wear on your microcontroller.

## ✨ Features

### Core Features
- ✅ **Fully browser-based** - No installation, no backend, runs entirely in your browser
- ✅ **Real-time preview** - See changes instantly with live preview mode
- ✅ **TFT_eSPI syntax** - Write code using familiar TFT_eSPI commands
- ✅ **Customizable dimensions** - Set any display size (1-1920 pixels)
- ✅ **WIDTH/HEIGHT constants** - Use display dimensions in your code
- ✅ **16-bit color support** - Full RGB565 color format support

### Advanced Features
- 📐 **Grid overlay** - Align elements precisely with a 10px grid
- 📱 **Display presets** - Quick access to common TFT sizes
- 💾 **Save/Load projects** - Export and import your UI code as JSON
- 🔄 **Auto-save** - Automatically saves to localStorage
- 🎨 **Syntax helper** - Built-in reference for all commands
- ⌨️ **Keyboard shortcuts** - Ctrl+Enter to render, Tab for indentation
- 📊 **Console output** - Error messages and rendering status
- 🎬 **Live preview** - Optional auto-render as you type

## 🚀 Getting Started

### Installation

1. **Download the project files:**
   - `index.html`
   - `styles.css`
   - `tft-parser.js`
   - `app.js`

2. **Open in browser:**
   - Simply open `index.html` in any modern web browser
   - No web server required!

### Quick Start

1. Set your display dimensions (e.g., 240x320)
2. Write TFT_eSPI code in the editor
3. Click "Render" or press Ctrl+Enter
4. See your UI rendered on the simulated display

## 📚 Supported Commands

### Screen Operations
```cpp
tft.fillScreen(color)                    // Fill entire screen with color
```

### Rectangle Drawing
```cpp
tft.fillRect(x, y, w, h, color)          // Draw filled rectangle
tft.drawRect(x, y, w, h, color)          // Draw rectangle outline
tft.fillRoundRect(x, y, w, h, r, color)  // Draw filled rounded rectangle
tft.drawRoundRect(x, y, w, h, r, color)  // Draw rounded rectangle outline
```

### Circle Drawing
```cpp
tft.fillCircle(x, y, radius, color)      // Draw filled circle
tft.drawCircle(x, y, radius, color)      // Draw circle outline
```

### Triangle Drawing
```cpp
tft.fillTriangle(x0, y0, x1, y1, x2, y2, color)  // Draw filled triangle
tft.drawTriangle(x0, y0, x1, y1, x2, y2, color)  // Draw triangle outline
```

### Line Drawing
```cpp
tft.drawLine(x0, y0, x1, y1, color)      // Draw line between two points
```

### Text Operations
```cpp
tft.setTextColor(color)                  // Set text color
tft.setTextSize(size)                    // Set text size (1-10)
tft.drawString("text", x, y)             // Draw text at position
tft.setCursor(x, y)                      // Set cursor position
tft.println("text")                      // Print text at cursor and move down
```

## 🎨 Color Formats

### Predefined Colors
The simulator supports all standard TFT_eSPI color constants:

- `TFT_BLACK` - Black (0x0000)
- `TFT_WHITE` - White (0xFFFF)
- `TFT_RED` - Red (0xF800)
- `TFT_GREEN` - Green (0x07E0)
- `TFT_BLUE` - Blue (0x001F)
- `TFT_CYAN` - Cyan (0x07FF)
- `TFT_MAGENTA` - Magenta (0xF81F)
- `TFT_YELLOW` - Yellow (0xFFE0)
- `TFT_ORANGE` - Orange (0xFD20)
- `TFT_PURPLE` - Purple (0x780F)
- `TFT_PINK` - Pink (0xF81F)
- `TFT_BROWN` - Brown (0x9A60)
- `TFT_GRAY` / `TFT_GREY` - Gray (0x8410)
- `TFT_DARKGRAY` / `TFT_DARKGREY` - Dark Gray (0x7BEF)
- `TFT_LIGHTGRAY` / `TFT_LIGHTGREY` - Light Gray (0xC618)

### Custom Colors (RGB565)
You can use 16-bit RGB565 color values:

```cpp
tft.fillScreen(0xF800);     // Red
tft.drawRect(0, 0, 100, 100, 0x07E0);  // Green
```

**RGB565 Format:** `RRRRRGGGGGGBBBBB`
- 5 bits for Red (0-31)
- 6 bits for Green (0-63)
- 5 bits for Blue (0-31)

## 📖 Example Code

### Simple Hello World
```cpp
tft.fillScreen(TFT_BLACK);
tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("Hello World!", 10, 10);
```

### Colorful UI Dashboard
```cpp
// Background
tft.fillScreen(TFT_BLACK);

// Header bar
tft.fillRect(0, 0, WIDTH, 30, TFT_BLUE);
tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("Dashboard", 10, 8);

// Status indicator
tft.fillCircle(WIDTH - 15, 15, 8, TFT_GREEN);

// Content card
tft.fillRoundRect(10, 40, WIDTH - 20, 100, 8, TFT_DARKGRAY);
tft.setTextColor(TFT_CYAN);
tft.setTextSize(1);
tft.drawString("Temperature:", 20, 50);

tft.setTextColor(TFT_YELLOW);
tft.setTextSize(3);
tft.drawString("23.5 C", 20, 70);

// Button
tft.fillRoundRect(10, 150, 100, 40, 5, TFT_RED);
tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("STOP", 25, 162);
```

### Using C++ Variables for Better Code Organization
```cpp
// Define all layout variables at the top
int margin = 10;
int headerHeight = 30;
int cardRadius = 8;
int buttonWidth = 100;
int buttonHeight = 40;

// Calculate derived values
int contentWidth = WIDTH - (margin * 2);
int contentY = headerHeight + margin;
int cardHeight = 100;

// Background
tft.fillScreen(TFT_BLACK);

// Header bar with variables
tft.fillRect(0, 0, WIDTH, headerHeight, TFT_BLUE);
tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("Dashboard", margin, 8);

// Status indicator positioned with variables
int indicatorY = headerHeight / 2;
tft.fillCircle(WIDTH - 20, indicatorY, 6, TFT_GREEN);

// Content card using all calculated values
tft.fillRoundRect(margin, contentY, contentWidth, cardHeight, cardRadius, TFT_DARKGRAY);

// Temperature display
tft.setTextColor(TFT_CYAN);
tft.setTextSize(1);
tft.drawString("Temperature:", margin + 10, contentY + 10);

tft.setTextColor(TFT_YELLOW);
tft.setTextSize(3);
tft.drawString("23.5 C", margin + 10, contentY + 30);

// Buttons with calculated positions
int buttonY = contentY + cardHeight + margin;
int rightButtonX = WIDTH - buttonWidth - margin;

tft.fillRoundRect(margin, buttonY, buttonWidth, buttonHeight, 5, TFT_RED);
tft.fillRoundRect(rightButtonX, buttonY, buttonWidth, buttonHeight, 5, TFT_GREEN);

tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("OFF", margin + 25, buttonY + 13);
tft.drawString("ON", rightButtonX + 30, buttonY + 13);
```

**Benefits of Using Variables:**
- ✅ Easier to maintain and modify layouts
- ✅ Change margins/spacing in one place
- ✅ More readable and self-documenting code
- ✅ Matches real microcontroller C++ code structure
- ✅ Consistent spacing and alignment

### Using WIDTH and HEIGHT
```cpp
// Center a rectangle on screen
tft.fillScreen(TFT_BLACK);

int boxWidth = 100;
int boxHeight = 80;
int x = (WIDTH - boxWidth) / 2;
int y = (HEIGHT - boxHeight) / 2;

tft.fillRect(x, y, boxWidth, boxHeight, TFT_BLUE);

// Draw border around entire screen
tft.drawRect(0, 0, WIDTH, HEIGHT, TFT_WHITE);

// Mathematical operations are fully supported
tft.fillRect(10, 10, WIDTH - 20, HEIGHT - 20, TFT_RED);  // Margins
tft.fillCircle(WIDTH / 2, HEIGHT / 2, 50, TFT_GREEN);    // Center
tft.drawLine(0, HEIGHT - 30, WIDTH, HEIGHT - 30, TFT_BLUE);  // Bottom line

// Complex expressions work too
tft.fillRect(WIDTH * 0.25, HEIGHT * 0.25, WIDTH * 0.5, HEIGHT * 0.5, TFT_YELLOW);
```

### C++ Variable Declarations

Declare your own variables using C++ syntax for cleaner, more maintainable code:

```cpp
// Integer variables
int margin = 10;
int headerHeight = 30;
int buttonWidth = 100;

// Floating point variables
float progress = 0.75;
double scale = 1.5;

// Unsigned integer types (common in embedded systems)
uint8_t brightness = 255;
uint16_t color = 0xF800;
uint32_t timestamp = 1000;

// Use variables in calculations
int contentWidth = WIDTH - (margin * 2);
int centerX = WIDTH / 2;
int rightEdge = WIDTH - buttonWidth - margin;

// Use variables in TFT commands
tft.fillRect(margin, margin, contentWidth, headerHeight, TFT_BLUE);
tft.fillCircle(centerX, HEIGHT / 2, 30, TFT_RED);
```

**Supported Variable Types:**
- `int` - Integer
- `float` - Floating point
- `double` - Double precision
- `uint8_t` - Unsigned 8-bit integer (0-255)
- `uint16_t` - Unsigned 16-bit integer (0-65535)
- `uint32_t` - Unsigned 32-bit integer
- `long` - Long integer
- `short` - Short integer
- `byte` - Byte (alias for uint8_t)

**Variable Usage Examples:**
```cpp
// Define layout variables
int margin = 10;
int spacing = 5;
int cardWidth = WIDTH - (margin * 2);
int cardHeight = 80;

// Calculate positions
int card1Y = 40;
int card2Y = card1Y + cardHeight + spacing;
int card3Y = card2Y + cardHeight + spacing;

// Draw cards using variables
tft.fillRoundRect(margin, card1Y, cardWidth, cardHeight, 5, TFT_BLUE);
tft.fillRoundRect(margin, card2Y, cardWidth, cardHeight, 5, TFT_GREEN);
tft.fillRoundRect(margin, card3Y, cardWidth, cardHeight, 5, TFT_RED);

// Use variables for color values
uint16_t primaryColor = 0x001F;  // Blue
uint16_t secondaryColor = 0xF800; // Red
tft.fillRect(0, 0, WIDTH, 30, primaryColor);
```

### Mathematical Operations

All arithmetic operations are supported in command arguments:
- **Addition:** `WIDTH + 10`
- **Subtraction:** `WIDTH - 20`
- **Multiplication:** `WIDTH * 0.5`
- **Division:** `HEIGHT / 2`
- **Parentheses:** `(WIDTH - 40) / 2`
- **Complex expressions:** `WIDTH * 0.25 + 10`

Examples:
```cpp
// Full width minus margins
tft.drawRect(10, 10, WIDTH - 20, HEIGHT - 20, TFT_WHITE);

// Center an element
tft.fillCircle(WIDTH / 2, HEIGHT / 2, 30, TFT_RED);

// Position from right edge
tft.drawString("Text", WIDTH - 80, 10);

// Percentage-based sizing
tft.fillRect(0, 0, WIDTH * 0.75, 50, TFT_BLUE);

// Using variables in expressions
int margin = 10;
tft.fillRect(margin, margin, WIDTH - margin * 2, HEIGHT - margin * 2, TFT_BLUE);
```

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + Enter** - Render the code
- **Tab** - Insert 4 spaces (indentation)

## 💾 Saving and Loading

### Auto-Save
Your code is automatically saved to browser localStorage whenever you modify it. It will be restored when you reopen the simulator.

### Manual Save
Click the **Save** button to download your project as a JSON file containing:
- Your code
- Display dimensions
- Timestamp

### Load
Click the **Load** button to import a previously saved JSON project file.

## 🏗️ Project Structure

```
tft-simulator/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── tft-parser.js       # TFT_eSPI command parser and Canvas renderer
├── app.js              # Application logic and UI controller
└── README.md           # This file
```

## 🔧 Technical Details

### How It Works

1. **Parser (`tft-parser.js`)**
   - Tokenizes TFT_eSPI commands
   - Converts RGB565 colors to RGB format
   - Resolves WIDTH/HEIGHT constants
   - Maps TFT commands to Canvas API calls

2. **Renderer**
   - Uses HTML5 Canvas for drawing
   - Simulates TFT pixel-perfect rendering
   - Supports all major TFT_eSPI drawing primitives

3. **Color Conversion**
   ```javascript
   // RGB565 (16-bit) → RGB (24-bit)
   R = ((color >> 11) & 0x1F) * 255 / 31
   G = ((color >> 5) & 0x3F) * 255 / 63
   B = (color & 0x1F) * 255 / 31
   ```

### Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- LocalStorage

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🎯 Use Cases

1. **Rapid UI Prototyping** - Design and iterate on UI layouts quickly
2. **Color Scheme Testing** - Experiment with different color combinations
3. **Layout Planning** - Plan element positioning before coding
4. **Client Previews** - Show UI mockups to clients without hardware
5. **Education** - Learn TFT_eSPI without needing hardware
6. **Documentation** - Generate screenshots for documentation

## ⚡ Performance Tips

1. **Use Live Preview sparingly** - Disable for complex UIs to avoid lag
2. **Start simple** - Test basic elements before building complex UIs
3. **Grid overlay** - Use for precise alignment but disable when rendering
4. **Clear console** - Clear console output periodically for better performance

## 🔮 Limitations

**What's Not Supported (Yet):**
- Bitmap/image rendering (drawBitmap, pushImage)
- Sprite operations
- Custom fonts
- Hardware-specific features (SPI settings, DMA)
- Touch input simulation
- Rotation commands (setRotation)

These features may be added in future versions.

## 🤝 Contributing

This is an open tool for the maker community. Feel free to:
- Report bugs or issues
- Suggest new features
- Improve the code
- Add more TFT_eSPI commands

## 📝 License

This project is open source and free to use for any purpose.

## 🙏 Credits

Inspired by the excellent [TFT_eSPI library](https://github.com/Bodmer/TFT_eSPI) by Bodmer.

## 📞 Support

For questions or issues:
1. Check the syntax helper (📖 button in the UI)
2. Review example code (Load Example button)
3. Check console output for error messages

---

**Happy prototyping! 🚀**

Save time, reduce flash wear, and iterate faster on your TFT display UIs!
