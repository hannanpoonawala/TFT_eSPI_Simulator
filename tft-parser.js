/**
 * TFT_eSPI Parser and Simulator
 * 
 * This module parses TFT_eSPI-like commands and converts them to HTML5 Canvas operations.
 * It simulates the behavior of the TFT_eSPI library used in microcontrollers.
 */

class TFTParser {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Current text properties
        this.textColor = '#FFFFFF';
        this.textSize = 1;
        this.cursorX = 0;
        this.cursorY = 0;
        
        // Base font size for text scaling
        this.baseFontSize = 8;
        
        // Color definitions (16-bit RGB565 to RGB)
        this.colors = {
            TFT_BLACK: 0x0000,
            TFT_NAVY: 0x000F,
            TFT_DARKGREEN: 0x03E0,
            TFT_DARKCYAN: 0x03EF,
            TFT_MAROON: 0x7800,
            TFT_PURPLE: 0x780F,
            TFT_OLIVE: 0x7BE0,
            TFT_LIGHTGRAY: 0xC618,
            TFT_LIGHTGREY: 0xC618,
            TFT_DARKGRAY: 0x7BEF,
            TFT_DARKGREY: 0x7BEF,
            TFT_BLUE: 0x001F,
            TFT_GREEN: 0x07E0,
            TFT_CYAN: 0x07FF,
            TFT_RED: 0xF800,
            TFT_MAGENTA: 0xF81F,
            TFT_YELLOW: 0xFFE0,
            TFT_WHITE: 0xFFFF,
            TFT_ORANGE: 0xFD20,
            TFT_GREENYELLOW: 0xAFE5,
            TFT_PINK: 0xF81F,
            TFT_BROWN: 0x9A60,
            TFT_GOLD: 0xFEA0,
            TFT_SILVER: 0xC618,
            TFT_SKYBLUE: 0x867D,
            TFT_VIOLET: 0x915C,
            TFT_GRAY: 0x8410,
            TFT_GREY: 0x8410
        };
    }

    /**
     * Convert 16-bit RGB565 color to CSS RGB string
     * RGB565 format: RRRRRGGGGGGBBBBB
     */
    rgb565ToRgb(color565) {
        // Handle hex string format (e.g., "0xF800")
        if (typeof color565 === 'string') {
            color565 = parseInt(color565, 16);
        }
        
        // Extract RGB components from 16-bit value
        const r = ((color565 >> 11) & 0x1F) * 255 / 31;
        const g = ((color565 >> 5) & 0x3F) * 255 / 63;
        const b = (color565 & 0x1F) * 255 / 31;
        
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    /**
     * Resolve color - handles predefined constants and hex values
     */
    resolveColor(colorInput) {
        // If it's a predefined color constant
        if (typeof colorInput === 'string' && colorInput.startsWith('TFT_')) {
            const colorValue = this.colors[colorInput];
            if (colorValue !== undefined) {
                return this.rgb565ToRgb(colorValue);
            }
        }
        
        // If it's a hex number (0xXXXX format)
        if (typeof colorInput === 'number' || (typeof colorInput === 'string' && colorInput.startsWith('0x'))) {
            return this.rgb565ToRgb(colorInput);
        }
        
        // Default to white if color not recognized
        return '#FFFFFF';
    }

    /**
     * Parse and execute TFT_eSPI commands
     */
    parse(code, width, height) {
        // Replace WIDTH and HEIGHT constants
        code = code.replace(/\bWIDTH\b/g, width.toString());
        code = code.replace(/\bHEIGHT\b/g, height.toString());
        
        // Split code into lines
        const lines = code.split('\n');
        const errors = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
                continue;
            }
            
            try {
                this.executeLine(line);
            } catch (error) {
                errors.push(`Line ${i + 1}: ${error.message}`);
            }
        }
        
        return errors;
    }

    /**
     * Execute a single line of TFT_eSPI code
     */
    executeLine(line) {
        // Remove semicolon if present
        line = line.replace(/;$/, '').trim();
        
        // Match tft.command(args) pattern
        const match = line.match(/tft\.(\w+)\((.*)\)/);
        
        if (!match) {
            // Skip lines that don't match the pattern (might be valid code structure)
            return;
        }
        
        const command = match[1];
        const argsString = match[2];
        
        // Parse arguments
        const args = this.parseArguments(argsString);
        
        // Execute the appropriate command
        switch (command) {
            case 'fillScreen':
                this.fillScreen(args);
                break;
            case 'fillRect':
                this.fillRect(args);
                break;
            case 'drawRect':
                this.drawRect(args);
                break;
            case 'drawLine':
                this.drawLine(args);
                break;
            case 'drawCircle':
                this.drawCircle(args);
                break;
            case 'fillCircle':
                this.fillCircle(args);
                break;
            case 'drawRoundRect':
                this.drawRoundRect(args);
                break;
            case 'fillRoundRect':
                this.fillRoundRect(args);
                break;
            case 'drawTriangle':
                this.drawTriangle(args);
                break;
            case 'fillTriangle':
                this.fillTriangle(args);
                break;
            case 'drawString':
                this.drawString(args);
                break;
            case 'setTextColor':
                this.setTextColor(args);
                break;
            case 'setTextSize':
                this.setTextSize(args);
                break;
            case 'setCursor':
                this.setCursor(args);
                break;
            case 'println':
                this.println(args);
                break;
            default:
                throw new Error(`Unknown command: ${command}`);
        }
    }

    /**
     * Parse function arguments from string
     */
    parseArguments(argsString) {
        if (!argsString.trim()) {
            return [];
        }
        
        const args = [];
        let current = '';
        let inString = false;
        let stringChar = null;
        let parenDepth = 0;
        
        for (let i = 0; i < argsString.length; i++) {
            const char = argsString[i];
            
            // Handle string delimiters
            if ((char === '"' || char === "'") && (i === 0 || argsString[i - 1] !== '\\')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = null;
                }
                continue;
            }
            
            // Track parentheses depth for nested expressions
            if (!inString) {
                if (char === '(') {
                    parenDepth++;
                } else if (char === ')') {
                    parenDepth--;
                }
            }
            
            // Split on comma only if not inside string or parentheses
            if (char === ',' && !inString && parenDepth === 0) {
                args.push(this.parseValue(current.trim()));
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            args.push(this.parseValue(current.trim()));
        }
        
        return args;
    }

    /**
     * Parse a single value (number, string, or color constant)
     */
    parseValue(value) {
        // String literal
        if (value.startsWith('"') || value.startsWith("'")) {
            return value.slice(1, -1);
        }
        
        // Color constant
        if (value.startsWith('TFT_')) {
            return value;
        }
        
        // Hex number
        if (value.startsWith('0x')) {
            return parseInt(value, 16);
        }
        
        // Check if it's a mathematical expression (contains operators)
        if (/[+\-*\/()]/.test(value)) {
            try {
                // Safely evaluate the expression
                return this.evaluateExpression(value);
            } catch (e) {
                // If evaluation fails, try parsing as number
                const num = parseFloat(value);
                if (!isNaN(num)) {
                    return num;
                }
            }
        }
        
        // Regular number
        const num = parseFloat(value);
        if (!isNaN(num)) {
            return num;
        }
        
        return value;
    }

    /**
     * Safely evaluate mathematical expressions
     * Supports basic arithmetic: +, -, *, /, (), and parentheses
     */
    evaluateExpression(expr) {
        // Remove whitespace
        expr = expr.trim();
        
        // Simple evaluation using Function constructor (safe for math expressions)
        // This will work because WIDTH and HEIGHT are already replaced in the code
        try {
            // Create a safe evaluation function
            const result = Function('"use strict"; return (' + expr + ')')();
            return result;
        } catch (e) {
            throw new Error(`Cannot evaluate expression: ${expr}`);
        }
    }

    // ==========================================
    // TFT_eSPI Command Implementations
    // ==========================================

    fillScreen(args) {
        if (args.length < 1) {
            throw new Error('fillScreen requires 1 argument: color');
        }
        
        const color = this.resolveColor(args[0]);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    fillRect(args) {
        if (args.length < 5) {
            throw new Error('fillRect requires 5 arguments: x, y, w, h, color');
        }
        
        const [x, y, w, h, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    drawRect(args) {
        if (args.length < 5) {
            throw new Error('drawRect requires 5 arguments: x, y, w, h, color');
        }
        
        const [x, y, w, h, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, w, h);
    }

    drawLine(args) {
        if (args.length < 5) {
            throw new Error('drawLine requires 5 arguments: x0, y0, x1, y1, color');
        }
        
        const [x0, y0, x1, y1, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }

    drawCircle(args) {
        if (args.length < 4) {
            throw new Error('drawCircle requires 4 arguments: x, y, r, color');
        }
        
        const [x, y, r, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    fillCircle(args) {
        if (args.length < 4) {
            throw new Error('fillCircle requires 4 arguments: x, y, r, color');
        }
        
        const [x, y, r, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawRoundRect(args) {
        if (args.length < 6) {
            throw new Error('drawRoundRect requires 6 arguments: x, y, w, h, r, color');
        }
        
        const [x, y, w, h, radius, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.roundRect(x, y, w, h, radius, false);
    }

    fillRoundRect(args) {
        if (args.length < 6) {
            throw new Error('fillRoundRect requires 6 arguments: x, y, w, h, r, color');
        }
        
        const [x, y, w, h, radius, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.fillStyle = color;
        this.roundRect(x, y, w, h, radius, true);
    }

    roundRect(x, y, w, h, radius, fill) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + w - radius, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        this.ctx.lineTo(x + w, y + h - radius);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        this.ctx.lineTo(x + radius, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        
        if (fill) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    drawTriangle(args) {
        if (args.length < 7) {
            throw new Error('drawTriangle requires 7 arguments: x0, y0, x1, y1, x2, y2, color');
        }
        
        const [x0, y0, x1, y1, x2, y2, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    fillTriangle(args) {
        if (args.length < 7) {
            throw new Error('fillTriangle requires 7 arguments: x0, y0, x1, y1, x2, y2, color');
        }
        
        const [x0, y0, x1, y1, x2, y2, colorInput] = args;
        const color = this.resolveColor(colorInput);
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawString(args) {
        if (args.length < 3) {
            throw new Error('drawString requires 3 arguments: text, x, y');
        }
        
        const [text, x, y] = args;
        
        this.ctx.fillStyle = this.textColor;
        this.ctx.font = `${this.baseFontSize * this.textSize}px monospace`;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, x, y);
    }

    setTextColor(args) {
        if (args.length < 1) {
            throw new Error('setTextColor requires 1 argument: color');
        }
        
        this.textColor = this.resolveColor(args[0]);
    }

    setTextSize(args) {
        if (args.length < 1) {
            throw new Error('setTextSize requires 1 argument: size');
        }
        
        this.textSize = Math.max(1, Math.min(10, args[0]));
    }

    setCursor(args) {
        if (args.length < 2) {
            throw new Error('setCursor requires 2 arguments: x, y');
        }
        
        this.cursorX = args[0];
        this.cursorY = args[1];
    }

    println(args) {
        if (args.length < 1) {
            throw new Error('println requires 1 argument: text');
        }
        
        const text = args[0];
        
        this.ctx.fillStyle = this.textColor;
        this.ctx.font = `${this.baseFontSize * this.textSize}px monospace`;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, this.cursorX, this.cursorY);
        
        // Move cursor down
        this.cursorY += this.baseFontSize * this.textSize * 1.5;
    }
}

// Export for use in main app
window.TFTParser = TFTParser;
