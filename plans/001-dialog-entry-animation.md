# Plan 001: Dialog Entry Animation

## Overview
The "Request a Quote" dialog snaps open instantly without any entry animation on the `Dialog.Content`, causing a jarring interruption. We need to add a springy entry animation (or standard Tailwind `animate-in`) with a centered transform origin.

## Target File
`src/components/providers/quote-dialog-provider.tsx`

## Current Code (Lines 39-40)
```tsx
<Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[90vh] w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-co-card-border bg-white">
```

## Exact Fix
Add Tailwind animation classes to the `className` of `Dialog.Content`.

Replace the current code with:
```tsx
<Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[90vh] w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-co-card-border bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:duration-200" style={{ transformOrigin: "center" }}>
```

## Verification
1. Open the app in the browser.
2. Click "Request a Quote" to open the dialog.
3. Observe that the dialog scales in slightly from 95% while fading in, rather than snapping instantly.
