# Plan 004: Header Transition Performance

## Overview
The site header uses `transition-all duration-300 ease-in-out` on its outer shell. `transition-all` hurts scroll performance because it forces layout/paint properties to constantly re-evaluate. It also feels slightly sluggish for a scroll-linked UI change.

## Target File
`src/components/layout/site-header.tsx`

## Current Code (Lines 26-27)
```tsx
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b transition-all duration-300 ease-in-out",
```

## Exact Fix
Replace `transition-all` with specific properties (background, border, shadow) and speed it up to `200ms` with `ease-out`.

```tsx
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color,box-shadow] duration-200 ease-out",
```

## Verification
1. Scroll down the page.
2. The header's background should change slightly faster and with better performance on low-end devices.
