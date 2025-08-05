#!/usr/bin/env python3
"""
Convert OKLCH colors to HEX using approximate conversions
Based on the CSS Color Module Level 4 specification
"""

import math


def oklch_to_rgb(l, c, h):
    """Convert OKLCH to RGB (0-255 range)"""
    # Convert to Lab
    h_rad = h * math.pi / 180
    a = c * math.cos(h_rad)
    b = c * math.sin(h_rad)

    # OKLab to linear RGB (simplified conversion)
    l_ = l + 0.3963377774 * a + 0.2158037573 * b
    m_ = l - 0.1055613458 * a - 0.0638541728 * b
    s_ = l - 0.0894841775 * a - 1.2914855480 * b

    l = l_ * l_ * l_
    m = m_ * m_ * m_
    s = s_ * s_ * s_

    # Convert to linear RGB
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

    # Apply gamma correction and clamp
    def gamma_correct(channel):
        if channel <= 0.0031308:
            return 12.92 * channel
        else:
            return 1.055 * (channel ** (1 / 2.4)) - 0.055

    r = max(0, min(1, gamma_correct(r)))
    g = max(0, min(1, gamma_correct(g)))
    b = max(0, min(1, gamma_correct(b)))

    # Convert to 0-255 range
    return int(r * 255), int(g * 255), int(b * 255)


def rgb_to_hex(r, g, b):
    """Convert RGB to HEX"""
    return f"#{r:02x}{g:02x}{b:02x}"


def oklch_to_hex(oklch_str):
    """Convert OKLCH color string to HEX"""
    try:
        l, c, h = parse_oklch(oklch_str)
        r, g, b = oklch_to_rgb(l, c, h)
        return rgb_to_hex(r, g, b)
    except Exception:
        # Return original string if conversion fails
        return oklch_str


def parse_oklch(oklch_str):
    """Parse oklch string to get L, C, H values"""
    # Remove 'oklch(' and ')'
    values_str = oklch_str.replace("oklch(", "").replace(")", "").strip()
    parts = values_str.split()

    # Parse L (lightness) - can be percentage or decimal
    l_str = parts[0]
    if "%" in l_str:
        l = float(l_str.replace("%", "")) / 100
    else:
        l = float(l_str)

    # Parse C (chroma) - always decimal
    c = float(parts[1])

    # Parse H (hue) - in degrees
    h = float(parts[2])

    return l, c, h


# Define all oklch colors
oklch_colors = {
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
        "--color-error-content": "oklch(97% 0.02 15)",
    },
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
        "--color-error-content": "oklch(97% 0.02 15)",
    },
}

# Convert all colors
print("=== CONVERTED COLORS ===\n")

for theme_name, colors in oklch_colors.items():
    print(f"/* {theme_name.upper()} THEME - HEX VALUES */")
    print(f'[data-theme="{theme_name}"] {{')

    # Group by color type
    groups = {
        "Base colors": ["base-100", "base-200", "base-300", "base-content"],
        "Primary colors": ["primary", "primary-content"],
        "Secondary colors": ["secondary", "secondary-content"],
        "Accent colors": ["accent", "accent-content"],
        "Neutral colors": ["neutral", "neutral-content"],
        "State colors": [
            "info",
            "info-content",
            "success",
            "success-content",
            "warning",
            "warning-content",
            "error",
            "error-content",
        ],
    }

    for group_name, color_names in groups.items():
        print(f"    /* {group_name} */")
        for color_name in color_names:
            var_name = f"--color-{color_name}"
            if var_name in colors:
                oklch_str = colors[var_name]
                try:
                    l, c, h = parse_oklch(oklch_str)
                    r, g, b = oklch_to_rgb(l, c, h)
                    hex_color = rgb_to_hex(r, g, b)
                    print(f"    {var_name}: {hex_color};")
                except Exception:
                    print(f"    {var_name}: /* Error converting {oklch_str} */")
        print()

    print("}\n")
