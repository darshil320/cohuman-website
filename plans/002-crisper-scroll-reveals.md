# Plan 002: Crisper Scroll Reveals

## Overview
The scroll reveals use `duration: 0.6`, which feels sluggish on fast scrolling. We will tighten the duration to `0.4` while preserving the ease-out curve.

## Target File
`src/components/ui/scroll-reveal.tsx`

## Current Code (Lines 20)
```tsx
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
```
and `StaggerItem` (Line 66):
```tsx
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
```

## Exact Fix
Update `duration: 0.6` to `duration: 0.4` in `Reveal`.
Update `duration: 0.5` to `duration: 0.4` in `StaggerItem`.

```tsx
// Line 20
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}

// Line 66
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
```

## Verification
1. Scroll down the page quickly.
2. Ensure elements reveal slightly faster, creating a crisper, more responsive feel without being jagged.
