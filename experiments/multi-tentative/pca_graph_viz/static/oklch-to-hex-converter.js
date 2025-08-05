// OKLCH to HEX converter using browser's computed styles
// This script creates temporary elements to let the browser convert oklch to rgb

function convertOklchToHex() {
    // Create a temporary element for color computation
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    document.body.appendChild(tempDiv);
    
    // Function to convert rgb to hex
    function rgbToHex(rgb) {
        // Match rgb(r, g, b) or rgba(r, g, b, a)
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return rgb;
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Extract all oklch colors from the HTML file
    const oklchColors = {
        // Bolt (Light) theme
        "bolt": {
            "--color-base-100": "oklch(99.5% 0.002 120)",
            "--color-base-200": "oklch(97.5% 0.005 200)",
            "--color-base-300": "oklch(94% 0.008 120)",
            "--color-base-content": "oklch(22% 0.015 240)",
            "--color-primary": "oklch(45% 0.18 285)",
            "--color-primary-content": "oklch(97% 0.02 285)",
            "--color-secondary": "oklch(0.4663 0.2626 340.55)",
            "--color-secondary-content": "oklch(97% 0.02 240)",
            "--color-accent": "oklch(80% 0.12 80)",
            "--color-accent-content": "oklch(22% 0.015 85)",
            "--color-neutral": "oklch(25% 0.01 240)",
            "--color-neutral-content": "oklch(95% 0.01 240)",
            "--color-info": "oklch(55% 0.20 220)",
            "--color-info-content": "oklch(97% 0.02 220)",
            "--color-success": "oklch(58% 0.18 140)",
            "--color-success-content": "oklch(97% 0.02 140)",
            "--color-warning": "oklch(68% 0.15 65)",
            "--color-warning-content": "oklch(25% 0.05 65)",
            "--color-error": "oklch(62% 0.22 15)",
            "--color-error-content": "oklch(97% 0.02 15)"
        },
        // Night (Dark) theme
        "night": {
            "--color-base-100": "oklch(20% 0.01 240)",
            "--color-base-200": "oklch(25% 0.01 240)",
            "--color-base-300": "oklch(30% 0.015 240)",
            "--color-base-content": "oklch(95% 0.01 240)",
            "--color-primary": "oklch(55% 0.18 285)",
            "--color-primary-content": "oklch(97% 0.02 285)",
            "--color-secondary": "oklch(70% 0.12 80)",
            "--color-secondary-content": "oklch(10% 0.02 80)",
            "--color-accent": "oklch(60% 0.12 240)",
            "--color-accent-content": "oklch(97% 0.02 240)",
            "--color-neutral": "oklch(25% 0.01 240)",
            "--color-neutral-content": "oklch(95% 0.01 240)",
            "--color-info": "oklch(55% 0.20 220)",
            "--color-info-content": "oklch(97% 0.02 220)",
            "--color-success": "oklch(58% 0.18 140)",
            "--color-success-content": "oklch(97% 0.02 140)",
            "--color-warning": "oklch(68% 0.15 65)",
            "--color-warning-content": "oklch(25% 0.05 65)",
            "--color-error": "oklch(62% 0.22 15)",
            "--color-error-content": "oklch(97% 0.02 15)"
        }
    };
    
    const results = {};
    
    // Convert each theme's colors
    for (const [themeName, colors] of Object.entries(oklchColors)) {
        results[themeName] = {};
        
        for (const [varName, oklchValue] of Object.entries(colors)) {
            // Set the color on our temp element
            tempDiv.style.color = oklchValue;
            
            // Get computed style
            const computedColor = window.getComputedStyle(tempDiv).color;
            
            // Convert to hex
            const hexColor = rgbToHex(computedColor);
            
            results[themeName][varName] = hexColor;
        }
    }
    
    // Clean up
    document.body.removeChild(tempDiv);
    
    // Format results for easy copying
    console.log("=== CONVERTED COLORS ===\n");
    
    for (const [themeName, colors] of Object.entries(results)) {
        console.log(`/* ${themeName.toUpperCase()} THEME */`);
        console.log(`[data-theme="${themeName}"] {`);
        
        // Group by color type
        const groups = {
            "Base colors": ["base-100", "base-200", "base-300", "base-content"],
            "Primary colors": ["primary", "primary-content"],
            "Secondary colors": ["secondary", "secondary-content"],
            "Accent colors": ["accent", "accent-content"],
            "Neutral colors": ["neutral", "neutral-content"],
            "State colors": ["info", "info-content", "success", "success-content", "warning", "warning-content", "error", "error-content"]
        };
        
        for (const [groupName, colorNames] of Object.entries(groups)) {
            console.log(`    /* ${groupName} */`);
            for (const colorName of colorNames) {
                const varName = `--color-${colorName}`;
                if (colors[varName]) {
                    console.log(`    ${varName}: ${colors[varName]};`);
                }
            }
            console.log("");
        }
        
        console.log("}\n");
    }
    
    return results;
}

// Run the converter when this script is loaded in a browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertOklchToHex);
    } else {
        convertOklchToHex();
    }
} 