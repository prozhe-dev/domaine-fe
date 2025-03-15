# Domaine Technical Assessment

## Project Overview

This project demonstrates an innovative approach to product card implementations, specifically focusing on two different solutions for showcasing product colorways on product cards. This implementation highlights modern frontend development practices and component architecture for a Shopify storefront.

## Key Features

### Colorway Display Methods

1. **Solution 1: Variant Colorways**

   - Colorways are implemented as Shopify product variants using the Color option
   - Color option is linked with the Color product metafield (`shopify.color-pattern` metaobjects store swatch data such as hex codes, patterns, etc)
   - Each variant has custom metafield called `images` storing colorway-specific images (`variant.metafields.custom.images`)
   - Best suited for products with limited color variations and product media as Shopify has limits on the number of variants and product media

2. **Solution 2: Product Colorways**
   - Colorways are implemented as separate but related Shopify products
   - Products are associated using a shared tag system (e.g., `sid:123`, `style-id:123` or `product-group:123`)
   - Each product maintains its own inventory, media (images, videos, 3D models), url, tags, status, state, description, and metadata
   - Highly scalable approach that simplifies product/colorway management
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
└── theme.ts       # Globally shared Shopify theme configuration
└── theme.css      # Globally shared Shopify theme styles
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/prozhe-dev/domaine-fe.git
```

2. Install dependencies:

```bash
npm i
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

This repository has been intentionally kept super minimal and native (without heavily relying on other external frontend libraries/frameworks)—just the essentials to make reviewing easier, so some typical theme files aren’t included.

For production implementations, consider using modern frontend libraries/frameworks such as:

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
