# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# TrueForce Application

## Codebase Structure

```
src/
├── assets/           # Static assets like images, fonts, etc.
├── components/       # Reusable UI components
│   ├── common/       # Common components used across multiple features
│   ├── dashboard/    # Dashboard-specific components
│   │   ├── stats/    # Statistics components (customer stats, etc.)
│   │   ├── tables/   # Table components (customer table, etc.)
│   │   └── cards/    # Card components
│   └── auth/         # Authentication-related components
├── hooks/            # Custom React hooks
├── lib/              # Third-party library configurations
├── pages/            # Page components
│   ├── auth/         # Authentication pages (login, register, etc.)
│   └── dashboard/    # Dashboard pages 
│       ├── index.tsx # Main dashboard
│       └── reports.tsx # Reports page
├── routes/           # Routing configuration
├── service/          # API service and data fetching
│   ├── api/          # API clients and endpoints
│   └── models/       # Data models and types
├── store/            # State management (Redux, Context, etc.)
├── utils/            # Utility functions and helpers
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## Suggested Refactoring

1. **Component Organization**:
   - Move dashboard-specific components from `pages/dashboard/reports.tsx` into separate component files.
   - Create specialized component directories: `components/dashboard/stats/`, `components/dashboard/tables/`, etc.

2. **Data Management**:
   - Create models for data structures (Customer, User, etc.)
   - Implement proper API service layer

3. **Styling**:
   - Consider organizing Tailwind styles into component-specific files
   - Extract reusable UI patterns into custom components

## Implementation Plan

1. Create the directory structure
2. Refactor the Reports page by breaking it down into:
   - `StatCard.tsx` - For the statistics cards
   - `CustomerTable.tsx` - For the customer table component
   - `SearchBar.tsx` - For the search functionality
   - `Pagination.tsx` - For table pagination
   
3. Create proper data models and services for customer data
