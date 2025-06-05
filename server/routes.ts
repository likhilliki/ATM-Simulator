import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { amountSchema, pinSchema } from "@shared/schema";
import { z } from "zod";
import { randomUUID } from "crypto";
import session from "express-session";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    cardNumber?: string;
    authenticated?: boolean;
    lastActive?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || "atm-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 120000, // 2 minutes in milliseconds
    },
    store: new MemoryStoreSession({
      checkPeriod: 3600000 // Prune expired entries every hour
    })
  }));

  // Middleware to check session
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.authenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Update last active timestamp
    req.session.lastActive = Date.now();
    next();
  };

  // API routes
  app.post("/api/auth/verify-card", async (req, res) => {
    const { cardNumber } = req.body;

    if (!cardNumber) {
      return res.status(400).json({ message: "Card number is required" });
    }

    const user = await storage.getUserByCardNumber(cardNumber);

    if (!user) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Store card number in session for PIN verification
    req.session.cardNumber = cardNumber;

    return res.status(200).json({ message: "Card verified" });
  });

  app.post("/api/auth/verify-pin", async (req, res) => {
    const { pin } = req.body;
    const cardNumber = req.session.cardNumber;

    if (!cardNumber) {
      return res.status(400).json({ message: "No card inserted" });
    }

    try {
      // Validate PIN format
      pinSchema.parse(pin);

      const isValid = await storage.verifyPin(cardNumber, pin);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid PIN" });
      }

      // Get user and account
      const user = await storage.getUserByCardNumber(cardNumber);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Set session data
      req.session.userId = user.id;
      req.session.authenticated = true;
      req.session.lastActive = Date.now();

      return res.status(200).json({ message: "PIN verified" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid PIN format" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/accounts/balance", requireAuth, async (req, res) => {
    const userId = req.session.userId;

    try {
      const account = await storage.getAccount(userId!);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      return res.status(200).json({
        balance: account.balance,
        availableCredit: account.availableCredit,
        withdrawalLimit: account.withdrawalLimit,
        lastUpdated: account.lastUpdated
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/accounts/details", requireAuth, async (req, res) => {
    const userId = req.session.userId;
    const cardNumber = req.session.cardNumber;

    try {
      const account = await storage.getAccount(userId!);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      return res.status(200).json({
        balance: account.balance,
        availableCredit: account.availableCredit,
        withdrawalLimit: account.withdrawalLimit,
        lastUpdated: account.lastUpdated,
        cardNumber: cardNumber?.replace(/\d(?=\d{4})/g, "*")
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/transactions/withdraw", requireAuth, async (req, res) => {
    const userId = req.session.userId;
    const { amount } = req.body;

    try {
      // Validate amount
      const validatedAmount = amountSchema.parse(Number(amount));

      const account = await storage.getAccount(userId!);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Check if sufficient funds
      if (account.balance < validatedAmount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Check withdrawal limit
      if (validatedAmount > account.withdrawalLimit) {
        return res.status(400).json({ message: "Amount exceeds daily withdrawal limit" });
      }

      // Update account balance
      const newBalance = Number(account.balance) - validatedAmount;
      const updatedAccount = await storage.updateAccountBalance(account.id, newBalance);

      // Create transaction record
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: "withdrawal",
        amount: -validatedAmount,
        description: "Cash Withdrawal",
        transactionId: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`
      });

      return res.status(200).json({
        message: "Withdrawal successful",
        transaction: {
          id: transaction.id,
          transactionId: transaction.transactionId,
          amount: validatedAmount,
          timestamp: transaction.timestamp
        },
        newBalance: updatedAccount.balance
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid amount. Amount must be positive, in multiples of $20, and maximum $1000." 
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/transactions/history", requireAuth, async (req, res) => {
    const userId = req.session.userId;

    try {
      const account = await storage.getAccount(userId!);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const transactions = await storage.getTransactions(account.id);

      return res.status(200).json({
        transactions,
        accountDetails: {
          balance: account.balance,
          availableCredit: account.availableCredit
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/session/status", (req, res) => {
    if (req.session.authenticated) {
      const lastActive = req.session.lastActive || 0;
      const currentTime = Date.now();
      const timeRemaining = Math.max(0, 120000 - (currentTime - lastActive));

      return res.status(200).json({ 
        authenticated: true,
        timeRemaining: Math.floor(timeRemaining / 1000) 
      });
    }

    return res.status(200).json({ 
      authenticated: false,
      timeRemaining: 0
    });
  });

  app.post("/api/session/refresh", requireAuth, (req, res) => {
    req.session.lastActive = Date.now();
    return res.status(200).json({ message: "Session refreshed" });
  });

  app.post("/api/transactions/deposit", requireAuth, async (req, res) => {
    const userId = req.session.userId;
    const { amount } = req.body;

    try {
      // Validate amount
      const validatedAmount = amountSchema.parse(Number(amount));

      // Check deposit limit
      if (validatedAmount > 10000) {
        return res.status(400).json({ message: "Amount exceeds daily deposit limit of $10,000" });
      }

      const account = await storage.getAccount(userId!);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Update account balance
      const newBalance = Number(account.balance) + validatedAmount;
      const updatedAccount = await storage.updateAccountBalance(account.id, newBalance);

      // Create transaction record
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: "deposit",
        amount: validatedAmount,
        description: "Cash Deposit",
        transactionId: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`
      });

      return res.status(200).json({
        message: "Deposit successful",
        transaction: {
          id: transaction.id,
          transactionId: transaction.transactionId,
          amount: validatedAmount,
          timestamp: transaction.timestamp
        },
        newBalance: updatedAccount.balance
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid amount. Amount must be positive and maximum $10,000." 
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}