# PeptiTrace Client

Frontend application for PeptiTrace, built with React, TypeScript, and Material-UI.

## Features

- Modern, responsive UI with Material-UI components
- Type-safe development with TypeScript
- State management with React Query
- Form handling with Formik and Yup
- Data visualization with Chart.js
- Authentication and protected routes
- Real-time updates and notifications

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/flackattacker/peptitrace-client.git
cd peptitrace-client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=PeptiTrace
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utility functions
└── App.tsx        # Root component
```

## Development

The application uses:
- Vite for fast development and building
- TypeScript for type safety
- Material-UI for components
- React Query for data fetching
- React Router for routing
- Formik & Yup for form handling
- Chart.js for data visualization

## License

MIT 