# Domaine Technical Assessment

## Project Overview

This project demonstrates an innovative approach to product card implementations, specifically focusing on two different solutions for showcasing product colorways on product cards. This implementation highlights modern frontend development practices and component architecture for a Shopify storefront.

## Key Features

### Colorway Display Methods

1. **Solution 1: Variant Colorways**

   - Colorways are implemented as Shopify product variants using the Color option
   - Each variant has custom metafields storing colorway-specific images
   - Uses a dedicated `shopify.color-pattern` metaobject to manage swatch colors and patterns
   - Best suited for products with limited color variations
   - Maintains all colorways within a single product for simpler inventory management

2. **Solution 2: Product Colorways**
   - Colorways are implemented as separate but related Shopify products
   - Products are associated using a shared tag system (e.g., `sid:123`)
   - Each product maintains its own inventory, media (images, videos, 3D models), url, tags, status, description, and metadata
   - Highly scalable approach that simplifies product management
   - Automated relationship management via Shopify Flow (e.g., `flow/set-colorways-metafields.flow`)
   - Ideal for products with extensive colorway options
   - Enables independent tracking of colorway-specific analytics and state

## Technical Stack

- **Shopify Liquid** - Template engine for dynamic content rendering
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Web Components** - Custom elements for encapsulated functionality
- **TypeScript** - Type-safe JavaScript for robust development
- **Vite** - Next-generation frontend tooling for fast development and building

## Project Structure

```
src/
├── components/    # Web Components and UI elements
└── libs/          # Libraries or modules
├── styles/        # Custom styles and animations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions and helpers
└── theme.ts       # Entry point for build process
└── theme.css      # Entry point for build process
```

## Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
```

3. Start Vite:

```bash
npm run dev
```

4. Start Shopify Theme:

```bash
npm run shopify:dev
```

## Development Approach

This minimal implementation showcases modern frontend development practices:

- Component-based architecture using Web Components
- Type-safe development with TypeScript
- Responsive design principles with Tailwind CSS
- Integration with Shopify's Liquid templating
- Performance optimization for smooth user experience

## Implementation Note

This repository has been intentionally stripped down to its essential components, focusing solely on demonstrating a basic approach to data fetching and mutation using native browser APIs and Shopify's custom product templates (`templates/product.card.liquid`) for JSON responses. While functional, it serves primarily as a proof of concept.

For production implementations, consider using modern frameworks/libraries such as:

- Hydrogen - Shopify's React framework (Remix.js)
- Alpine.js - Lightweight framework perfect for Shopify themes
- Vue.js - Full-featured framework with robust state management
- Preact - Lightweight alternative to React with similar paradigms

These tools provide more elegant solutions for:

- Structured data fetching and caching
- Centralized state management
- Efficient DOM updates
- Component lifecycle management
- And more...

## Contact

For any questions or feedback regarding this repository, please reach out to me at [rez@prozhe.dev].

---

Built with ❤️ for Domain Agency Technical Assessment
