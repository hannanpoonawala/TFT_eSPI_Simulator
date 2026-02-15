/**
 * Main Application Controller
 * Handles UI interactions, rendering, and state management
 */

class TFTSimulator {
    constructor() {
        // Get DOM elements
        this.canvas = document.getElementById('tftCanvas');
        this.gridCanvas = document.getElementById('gridCanvas');
        this.codeEditor = document.getElementById('codeEditor');
        this.consoleOutput = document.getElementById('console');
        this.widthInput = document.getElementById('width');
        this.heightInput = document.getElementById('height');
        this.displayInfo = document.getElementById('displayInfo');
        this.lineCount = document.getElementById('lineCount');
        
        // Initialize parser
        this.parser = new TFTParser(this.canvas);
        
        // State
        this.livePreviewEnabled = false;
        this.livePreviewTimeout = null;
        
        // Initialize
        this.init();
    }

    init() {
        // Set initial canvas size
        this.updateCanvasSize();
        
        // Bind event listeners
        this.bindEvents();
        
        // Update line count
        this.updateLineCount();
        
        // Log welcome message
        this.log('TFT_eSPI Simulator ready!', 'success');
        this.log('Enter your code and click "Render" to see the output.', 'info');
        
        // Load saved code if exists
        this.loadFromLocalStorage();
    }

    bindEvents() {
        // Render button
        document.getElementById('renderBtn').addEventListener('click', () => {
            this.render();
        });

        // Apply dimensions button
        document.getElementById('applyDimensions').addEventListener('click', () => {
            this.updateCanvasSize();
        });

        // Preset buttons
        document.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const [width, height] = e.target.dataset.preset.split(',');
                this.widthInput.value = width;
                this.heightInput.value = height;
                this.updateCanvasSize();
            });
        });

        // Show grid toggle
        document.getElementById('showGrid').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.showGrid();
            } else {
                this.hideGrid();
            }
        });

        // Live preview toggle
        document.getElementById('livePreview').addEventListener('change', (e) => {
            this.livePreviewEnabled = e.target.checked;
            if (this.livePreviewEnabled) {
                this.log('Live preview enabled', 'info');
            } else {
                this.log('Live preview disabled', 'info');
            }
        });

        // Code editor changes
        this.codeEditor.addEventListener('input', () => {
            this.updateLineCount();
            
            // Live preview with debounce
            if (this.livePreviewEnabled) {
                clearTimeout(this.livePreviewTimeout);
                this.livePreviewTimeout = setTimeout(() => {
                    this.render(true); // Silent render for live preview
                }, 500);
            }
        });

        // Clear console
        document.getElementById('clearConsole').addEventListener('click', () => {
            this.clearConsole();
        });

        // Load example
        document.getElementById('loadExample').addEventListener('click', () => {
            this.loadExample();
        });

        // Clear code
        document.getElementById('clearCode').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all code?')) {
                this.codeEditor.value = '';
                this.updateLineCount();
                this.log('Code cleared', 'info');
            }
        });

        // Save code
        document.getElementById('saveCode').addEventListener('click', () => {
            this.saveCode();
        });

        // Load code
        document.getElementById('loadCode').addEventListener('click', () => {
            this.loadCode();
        });

        // Keyboard shortcuts
        this.codeEditor.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to render
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.render();
            }
            
            // Tab key for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.codeEditor.selectionStart;
                const end = this.codeEditor.selectionEnd;
                const value = this.codeEditor.value;
                
                this.codeEditor.value = value.substring(0, start) + '    ' + value.substring(end);
                this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 4;
            }
        });
    }

    updateCanvasSize() {
        const width = parseInt(this.widthInput.value);
        const height = parseInt(this.heightInput.value);

        if (width < 1 || height < 1 || width > 1920 || height > 1920) {
            this.log('Invalid dimensions. Width and height must be between 1 and 1920.', 'error');
            return;
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.gridCanvas.width = width;
        this.gridCanvas.height = height;

        // Update display info
        this.displayInfo.textContent = `${width} x ${height} px`;

        // Clear canvas
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Reinitialize parser with new canvas
        this.parser = new TFTParser(this.canvas);

        // Update grid if enabled
        if (document.getElementById('showGrid').checked) {
            this.showGrid();
        }

        this.log(`Canvas resized to ${width}x${height}`, 'info');
    }

    render(silent = false) {
        const code = this.codeEditor.value;
        const width = this.canvas.width;
        const height = this.canvas.height;

        if (!silent) {
            this.clearConsole();
            this.log('Rendering...', 'info');
        }

        // Clear canvas
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Parse and render
        try {
            const errors = this.parser.parse(code, width, height);
            
            if (errors.length > 0) {
                errors.forEach(error => {
                    this.log(error, 'error');
                });
                if (!silent) {
                    this.log(`Rendering completed with ${errors.length} error(s)`, 'warning');
                }
            } else {
                if (!silent) {
                    this.log('Rendering completed successfully!', 'success');
                }
            }
        } catch (error) {
            this.log(`Fatal error: ${error.message}`, 'error');
            console.error(error);
        }
    }

    showGrid() {
        const ctx = this.gridCanvas.getContext('2d');
        const width = this.gridCanvas.width;
        const height = this.gridCanvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 1;

        // Draw grid lines every 10 pixels
        const gridSize = 10;

        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        this.gridCanvas.style.display = 'block';
        this.log('Grid overlay enabled', 'info');
    }

    hideGrid() {
        this.gridCanvas.style.display = 'none';
        this.log('Grid overlay disabled', 'info');
    }

    updateLineCount() {
        const lines = this.codeEditor.value.split('\n').length;
        this.lineCount.textContent = lines;
    }

    log(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `console-message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        messageEl.textContent = `[${timestamp}] ${message}`;
        
        this.consoleOutput.appendChild(messageEl);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    clearConsole() {
        this.consoleOutput.innerHTML = '';
    }

    loadExample() {
        const example = `// TFT_eSPI Example - Colorful UI Demo with Variables
// Use WIDTH and HEIGHT constants for display dimensions
// Declare your own variables using C++ syntax

// Define some variables for reusability
int margin = 10;
int headerHeight = 30;
int buttonWidth = 100;
int buttonHeight = 40;
int cardRadius = 8;

// Calculate positions
int contentY = headerHeight + margin;
int contentWidth = WIDTH - (margin * 2);
int buttonY = 180;
int rightButtonX = WIDTH - buttonWidth - margin;

// Fill background
tft.fillScreen(TFT_BLACK);

// Draw header bar using variables
tft.fillRect(0, 0, WIDTH, headerHeight, TFT_BLUE);
tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("TFT Display", margin, 8);

// Draw status indicators (positioned from right edge)
int indicatorY = headerHeight / 2;
tft.fillCircle(WIDTH - 20, indicatorY, 6, TFT_GREEN);
tft.fillCircle(WIDTH - 40, indicatorY, 6, TFT_YELLOW);

// Draw main content area using calculated variables
tft.fillRoundRect(margin, contentY, contentWidth, 100, cardRadius, TFT_DARKGRAY);

// Draw text content
tft.setTextColor(TFT_CYAN);
tft.setTextSize(2);
tft.drawString("Temperature:", 20, 50);

tft.setTextColor(TFT_YELLOW);
tft.setTextSize(3);
tft.drawString("25.5 C", 20, 75);

// Draw progress bar using variables
int progressY = 150;
int progressHeight = 20;
float progressPercent = 0.65;

tft.drawRect(margin, progressY, contentWidth, progressHeight, TFT_WHITE);
tft.fillRect(margin + 2, progressY + 2, (contentWidth - 4) * progressPercent, progressHeight - 4, TFT_GREEN);

// Draw buttons using pre-calculated positions
tft.fillRoundRect(margin, buttonY, buttonWidth, buttonHeight, 5, TFT_RED);
tft.fillRoundRect(rightButtonX, buttonY, buttonWidth, buttonHeight, 5, TFT_GREEN);

tft.setTextColor(TFT_WHITE);
tft.setTextSize(2);
tft.drawString("OFF", margin + 25, buttonY + 13);
tft.drawString("ON", rightButtonX + 30, buttonY + 13);

// Draw decorative line at bottom
int footerY = HEIGHT - 40;
tft.drawLine(0, footerY, WIDTH, footerY, TFT_BLUE);

// Draw footer text
tft.setTextColor(TFT_LIGHTGRAY);
tft.setTextSize(1);
tft.drawString("System Status: OK", margin, HEIGHT - 30);

// Draw shapes demonstration using variables
int shapeY = HEIGHT - 80;
tft.drawCircle(50, shapeY, 20, TFT_MAGENTA);
tft.fillTriangle(120, shapeY + 20, 100, shapeY - 20, 140, shapeY - 20, TFT_ORANGE);
tft.drawRect(160, shapeY - 20, 40, 40, TFT_CYAN);

// Centered rectangle demonstration
int centerX = WIDTH / 2;
int centerY = HEIGHT / 2;
tft.fillRect(centerX - 30, centerY - 20, 60, 40, TFT_PURPLE);
`;

        this.codeEditor.value = example;
        this.updateLineCount();
        this.log('Example code loaded with variable declarations', 'success');
    }

    saveCode() {
        const code = this.codeEditor.value;
        const width = this.widthInput.value;
        const height = this.heightInput.value;
        
        const data = {
            code: code,
            width: width,
            height: height,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tft-code-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Also save to localStorage
        localStorage.setItem('tft_simulator_code', JSON.stringify(data));
        
        this.log('Code saved successfully', 'success');
    }

    loadCode() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.code) {
                        this.codeEditor.value = data.code;
                        this.updateLineCount();
                    }
                    
                    if (data.width && data.height) {
                        this.widthInput.value = data.width;
                        this.heightInput.value = data.height;
                        this.updateCanvasSize();
                    }
                    
                    this.log('Code loaded successfully', 'success');
                } catch (error) {
                    this.log('Error loading file: Invalid JSON', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('tft_simulator_code');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                if (data.code) {
                    this.codeEditor.value = data.code;
                    this.updateLineCount();
                }
                
                if (data.width && data.height) {
                    this.widthInput.value = data.width;
                    this.heightInput.value = data.height;
                    this.updateCanvasSize();
                }
                
                this.log('Previous session restored', 'info');
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        }
    }
}

// Initialize the simulator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new TFTSimulator();
});
