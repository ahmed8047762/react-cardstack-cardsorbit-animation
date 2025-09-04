# React Orbit and Stack

Beautiful, production-ready and depandency free React components: an animated expanding/reducing testimonials Orbit and an Overlapping Feature Stack.

- **QuotesOrbit**: A circular, auto-animated orbit of testimonials/quotes with smooth motion.
- **FeatureStack**: Overlapping, scroll-aware feature cards with vivid backgrounds and images.

## Features

- Smooth CSS transforms and requestAnimationFrame-driven animations
- Responsive, accessible markup
- Easy to plug into any React app
- No external animation library required

## Components

1) **QuotesOrbit**
   - Displays quotes or testimonials orbiting around a center.
   - Good for landing pages and hero sections.

2) **FeatureStack**
   - Overlapping "stacked" feature cards with scroll-based motion.
   - Great for storytelling sections and feature showcases.

## Installation

Copy the components into your project:

```
src/
  components/
    landing/
      QuotesOrbit.jsx
      FeatureStack.jsx
  utils/
    assetUtils.js # optional helper used by FeatureStack
  assets/
    images/
      landing/
        image1.png
        image2.png
        image3.png
```

If you want to publish this as a package later, you can:
- Create an `index.js` that exports both components.
- Publish to npm with your preferred build setup (Vite, Rollup, or tsup).

## Usage

### QuotesOrbit

```jsx
import QuotesOrbit from './components/landing/QuotesOrbit';

const quotes = [
  { author: 'Jane Doe', role: 'CTO, Example Co', text: 'This made our landing page pop.' },
  { author: 'John Smith', role: 'Founder, Startup X', text: 'Slick and simple to integrate.' },
  { author: 'Alex Lin', role: 'Designer', text: 'Love the orbit effect!' },
];

export default function Hero() {
  return (
    <section>
      <h2>What people say</h2>
      <QuotesOrbit quotes={quotes} orbitRadius={160} speed={0.6} />
    </section>
  );
}
```

**Props (recommended)**
- `quotes` (array): `[{ author, role, text, avatar? }]`
- `orbitRadius` (number, optional): distance from center
- `speed` (number, optional): orbit speed multiplier

*Note: If your local code version doesn't accept props yet, you can adapt it quickly by lifting constants into props.*

### FeatureStack

```jsx
import FeatureStack from './components/landing/FeatureStack';

export default function Features() {
  return (
    <section style={{ marginTop: 80 }}>
      <FeatureStack />
    </section>
  );
}
```

**Notes**
- FeatureStack often uses an `assetUtils.getAssetPath()` helper and local images. Replace with your own image paths or adjust the helper.
- The component includes overlapping cards and scroll effects; ensure the section has enough vertical space.

## Styling

Both components use inline styles and standard CSS properties. If you prefer Tailwind or CSS Modules, you can move styles accordingly.

## Performance Tips

- Keep image sizes optimized (webp or modern formats).
- Reduce text content for orbit to maintain readability.
- Use `will-change: transform` on animated elements (already applied where useful).

## License

MIT

## Credits

If this repository has helped you in any way, please don't forget to give it a star to appreciate the hard work done by me :)
---

*If you want, I can scaffold this repo (with a minimal Vite React example, an index that exports both components, and the above README) and push it to GitHub.*
