# Plan 003: Form Success Crossfade

## Overview
When an enquiry form is submitted, the form unmounts instantly, causing a harsh layout shift and height jump. We will wrap the rendering in `AnimatePresence` and use `motion.div` to crossfade the states.

## Target File
`src/components/forms/enquiry-form.tsx`

## Current Code Overview
The code conditionally renders either the success message or the form:
```tsx
  if (sent) {
    return (
      <div className={compact ? "py-10 text-center" : "py-16 text-center sm:py-20"}>
...
  return (
    <form onSubmit={handleSubmit} className={compact ? "p-6" : "p-6 sm:p-8"}>
...
```

## Exact Fix
Import `motion` and `AnimatePresence` from `"framer-motion"`.
Wrap the conditional return in a shared wrapper that handles layout animations.
Because `form` vs `div` is returned directly, refactor the component to return an `AnimatePresence` with `mode="wait"` at the root.

```tsx
import { motion, AnimatePresence } from "framer-motion";

// Replace the return logic with:
  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div 
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={compact ? "py-10 text-center" : "py-16 text-center sm:py-20"}
        >
          {/* Success Content */}
        </motion.div>
      ) : (
        <motion.form 
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit} 
          className={compact ? "p-6" : "p-6 sm:p-8"}
        >
          {/* Form Content */}
        </motion.form>
      )}
    </AnimatePresence>
  );
```

## Verification
1. Fill out the "Request a quote" form.
2. Submit the form.
3. Observe a smooth crossfade and gentle exit/entry transition instead of an instant flash.
