# ATM Simulation Application

## Overview

This repository contains a full-stack ATM simulation application built with React on the frontend and Express on the backend. The application allows users to simulate ATM interactions such as card insertion, PIN verification, balance inquiry, cash withdrawal, and transaction history viewing.

The application uses a modern tech stack with TypeScript, React for the frontend, Express for the backend, and Drizzle ORM for database interactions. The UI is built with a combination of Tailwind CSS and the shadcn/ui component library, providing a clean and responsive user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is a React application organized around pages that represent different ATM screens. It follows a context-based state management approach through the ATM context provider (`ATMProvider`), which maintains session state, card details, and withdrawal amounts. 

The frontend uses React Query for API data fetching and caching, which simplifies server state management and provides a consistent approach to data synchronization between client and server.

The UI components are built on the shadcn/ui library, which provides a collection of accessible and customizable React components. These are styled with Tailwind CSS for consistent and responsive design.

### Backend Architecture

The backend is an Express.js server that provides API endpoints for ATM operations. The server is structured to handle authentication, account management, and transaction operations.

Server routes are registered in a centralized manner in `server/routes.ts`. The server uses session-based authentication to maintain user state between API calls, with session timeout features that mimic a real ATM's security measures.

### Data Layer

The application uses Drizzle ORM for database interactions, defined in the `shared/schema.ts` file. The schema includes tables for users, accounts, and transactions. 

For development and demo purposes, the application can work with an in-memory storage implementation (`MemStorage` in `server/storage.ts`), but it's configured to connect to a PostgreSQL database in production.

## Key Components

### Frontend Components

1. **ATM Context** (`client/src/contexts/atm-context.tsx`): Provides state management for the ATM application, handling session state, navigation, and notification display.

2. **ATM Layout** (`client/src/components/ui/atm-layout.tsx`): The main layout component that provides a consistent ATM interface across different screens.

3. **Pages**: Individual screens in the ATM flow, including:
   - Welcome page
   - PIN entry
   - Main menu
   - Balance inquiry
   - Withdrawal screens
   - Transaction history
   - Session management screens

4. **UI Components**: Reusable components like:
   - Card reader
   - PIN pad
   - Transaction item
   - Notification

### Backend Components

1. **Express Server** (`server/index.ts`): The main server entry point that sets up middleware and routes.

2. **API Routes** (`server/routes.ts`): Defines the API endpoints for the application.

3. **Storage Interface** (`server/storage.ts`): Provides an abstraction for data storage with implementations for both in-memory and database storage.

4. **Database Schema** (`shared/schema.ts`): Defines the database schema and validation using Drizzle ORM and Zod.

## Data Flow

1. **Authentication Flow**:
   - User "inserts" a card (simulated in the UI)
   - Card number is verified against the database
   - User enters PIN for verification
   - Upon successful verification, a session is created

2. **Account Operations**:
   - Balance inquiries fetch current account balance
   - Withdrawal requests validate against available balance
   - Transactions are recorded with timestamps and details

3. **Session Management**:
   - Sessions have a timeout (2 minutes of inactivity)
   - Warning is shown before session expiration
   - Sessions can be manually ended or time out automatically

## External Dependencies

### Frontend Libraries
- React for UI rendering
- React Query for data fetching
- Wouter for routing
- shadcn/ui components based on Radix UI primitives
- Tailwind CSS for styling
- Framer Motion for animations

### Backend Libraries
- Express for the HTTP server
- Express-session for session management
- Drizzle ORM for database interactions
- Zod for validation

## Deployment Strategy

The application is configured for deployment on Replit, with appropriate scripts for both development and production builds.

Development:
- `npm run dev` starts the server in development mode with hot reloading

Production:
- `npm run build` builds both frontend and backend
- `npm run start` runs the production server

The deployment uses Replit's autoscaling feature, with the build step configured to run `npm run build` and the run step set to `npm run start`.

## Database Configuration

The application is configured to work with PostgreSQL. In the Replit environment, it uses the PostgreSQL module provided by Replit.

The database schema is managed through Drizzle ORM, which provides a type-safe interface for database operations. The schema includes tables for users, accounts, and transactions, with appropriate relationships between them.

To initialize or update the database schema, the application provides a `db:push` script that uses Drizzle Kit to push schema changes to the database.

## Getting Started

1. Ensure PostgreSQL is set up in your Replit environment
2. Configure the `DATABASE_URL` environment variable
3. Run `npm run db:push` to initialize the database schema
4. Run `npm run dev` to start the development server

For production deployment:
1. Set `NODE_ENV=production`
2. Run `npm run build` to build the application
3. Run `npm run start` to start the production server