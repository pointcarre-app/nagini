# KaTeX Label Centering Fix

## Problem
KaTeX labels in small (20x20) foreign objects were not perfectly centered on graph lines. For example, labels at coordinates (1,1), (2,2), (3,3) appeared slightly offset from the diagonal line.

## Root Causes
1. **Padding**: The default padding of 0.25rem was taking up significant space in a 20x20 box
2. **Text baseline**: Text characters have a baseline that doesn't align with their geometric center
3. **KaTeX rendering**: KaTeX adds its own spacing and positioning that needed to be overridden

## Solution
Applied specialized CSS rules for 20x20 foreign objects:

```css
/* Remove padding and set precise dimensions */
foreignObject[width="20"][height="20"] .svg-latex {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 20px !important;
    width: 20px !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
}

/* Optimize font size and apply optical centering */
foreignObject[width="20"][height="20"] .katex {
    font-size: 11px !important;
    line-height: 1 !important;
    position: relative !important;
    transform: translate(0, -0.5px) !important; /* Optical adjustment */
}
```

## Key Changes
1. **Exact dimensions**: Set height and width to exactly 20px
2. **Zero spacing**: Removed all margins and padding
3. **Font optimization**: Reduced font size to 11px for better fit
4. **Optical adjustment**: Added -0.5px vertical transform to compensate for text baseline
5. **Overflow hidden**: Prevents any content from extending beyond the box

## Result
Labels now appear perfectly centered on their coordinate points, aligning precisely with graph lines.