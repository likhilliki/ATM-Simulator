
# ATM Simulation Application

A full-stack ATM simulation built with React, Express, and TypeScript that provides a realistic banking interface experience.

## 🏧 Features

- **Card Authentication**: Simulate card insertion and PIN verification
- **Balance Inquiry**: Check account balance and available credit
- **Cash Withdrawal**: Withdraw money with validation and limits
- **Cash Deposit**: Deposit money to your account
- **Transaction History**: View recent transactions
- **Session Management**: Automatic timeout and security features
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Query** for state management and API calls
- **Vite** for build tooling

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** database support
- **Express Session** for authentication
- **Zod** for validation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd atm-simulation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret_key
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🎮 Usage

### Demo Credentials
- **Card Number**: 4111111111111234
- **PIN**: 4567

### Basic Flow
1. Click "Insert Card" on the welcome screen
2. Enter your PIN using the numeric keypad
3. Navigate through the main menu to:
   - Check your balance
   - Withdraw cash (multiples of $20, max $1000)
   - Deposit cash (max $10,000)
   - View transaction history
   - Change PIN (demo only)

### API Endpoints

#### Authentication
- `POST /api/auth/verify-card` - Verify card number
- `POST /api/auth/verify-pin` - Verify PIN
- `POST /api/auth/logout` - End session

#### Account Operations
- `GET /api/accounts/balance` - Get account balance
- `GET /api/accounts/details` - Get account details

#### Transactions
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/deposit` - Deposit money
- `GET /api/transactions/history` - Get transaction history

#### Session Management
- `GET /api/session/status` - Check session status
- `POST /api/session/refresh` - Refresh session

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Application screens
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── database.ts         # Database storage implementation
│   ├── storage.ts          # Storage interface & in-memory implementation
│   ├── routes.ts           # API route definitions
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema & validation
└── README.md
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

### Key Components

#### Frontend
- **ATMContext**: Global state management for the application
- **ATMLayout**: Consistent layout wrapper for all screens
- **Pages**: Individual ATM screens (welcome, PIN entry, main menu, etc.)

#### Backend
- **Storage Interface**: Abstraction layer for data persistence
- **Routes**: RESTful API endpoints with session management
- **Database**: PostgreSQL integration with Drizzle ORM

## 🔒 Security Features

- Session-based authentication
- PIN validation with error handling
- Transaction limits and validation
- Automatic session timeout (2 minutes)
- Input sanitization and validation

## 🎨 UI/UX Features

- Realistic ATM interface design
- Smooth animations and transitions
- Mobile-responsive layout
- Accessibility-friendly components
- Loading states and error handling

## 🚀 Deployment

This application is designed to run on Replit. The server binds to `0.0.0.0:5000` to ensure proper port forwarding.

### Environment Variables for Production
```env
DATABASE_URL=your_production_postgresql_url
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Demo uses hardcoded card number and PIN
- In-memory storage resets on server restart
- Session timeout is set to 2 minutes for demo purposes

## 📧 Support

For questions or issues, please open an issue on the repository or contact the development team.

---

**Note**: This is a simulation for educational purposes. Do not use in production environments without proper security audits and enhancements.
