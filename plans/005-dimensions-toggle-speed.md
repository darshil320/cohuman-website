# Plan 005: Dimensions Toggle Speed

## Overview
The dimensions overlay on the product stage uses a linear `duration: 0.3` for fading in. This is too slow for a simple UI overlay, which should feel instantaneous but soft.

## Target File
`src/components/series/series-stage.tsx`

## Current Code (Lines 92)
```tsx
            transition={{ duration: 0.3 }}
```

## Exact Fix
Change the duration to `0.15` and add an ease curve.

```tsx
            transition={{ duration: 0.15, ease: "easeOut" }}
```

## Verification
1. Click the "Dimensions" toggle on the 3D stage viewer.
2. Ensure the green dimension lines snap in faster but remain smooth.
