# Qwik MegaMenu Component

A Qwik version of the Alpine.js MegaMenu component with the same functionality and styling.

## Usage

```tsx
import { MegaMenu } from "./components/qwik/MegaMenu";
// or
import MegaMenu from "./components/qwik";

const navigationData = [
  {
    label: "Services",
    link: "/services",
    submenu: [
      {
        label: "Web Development",
        link: "/services/web-dev",
        description: "Custom web applications and websites",
      },
      {
        label: "Mobile Apps",
        link: "/services/mobile",
        description: "iOS and Android applications",
      },
    ],
  },
];

export default component$(() => {
  return <MegaMenu primaryNav={navigationData} />;
});
```

## Key Differences from Alpine.js Version

1. **State Management**: Uses Qwik's `useSignal()` instead of Alpine.js `x-data`
2. **Event Handlers**: Uses Qwik's `$()` syntax for serializable event handlers
3. **Conditional Rendering**: Uses JSX conditional rendering instead of `x-show`
4. **Transitions**: Uses CSS classes with conditional logic instead of Alpine.js transitions
5. **TypeScript**: Full TypeScript support with proper interfaces

## Features

- ✅ Hover-triggered mega menu dropdown
- ✅ Smooth transitions and animations
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Same visual styling as Alpine.js version
- ✅ Keyboard accessible
- ✅ SEO-friendly server-side rendering
