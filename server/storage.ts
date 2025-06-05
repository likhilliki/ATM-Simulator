import { randomUUID } from "crypto";
import {
  User,
  InsertUser,
  Account,
  InsertAccount,
  Transaction,
  InsertTransaction,
} from "@shared/schema";
import { DatabaseStorage } from "./database";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, accounts, transactions } from "./database";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByCardNumber(cardNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPin(cardNumber: string, pin: string): Promise<boolean>;

  // Account operations
  getAccount(userId: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccountBalance(accountId: number, newBalance: number): Promise<Account>;

  // Transaction operations
  getTransactions(accountId: number, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private transactions: Map<number, Transaction>;
  private userIdCounter: number;
  private accountIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.userIdCounter = 1;
    this.accountIdCounter = 1;
    this.transactionIdCounter = 1;

    // Add a demo user and account
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: this.userIdCounter++,
      username: "demo_user",
      password: "password",
      pin: "1234",
      cardNumber: "4111111111111234",
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo account
    const demoAccount: Account = {
      id: this.accountIdCounter++,
      userId: demoUser.id,
      balance: 2547.63,
      availableCredit: 5000.0,
      withdrawalLimit: 1000.0,
      lastUpdated: new Date(),
    };
    this.accounts.set(demoAccount.id, demoAccount);

    // Add some demo transactions
    const transactions: Omit<Transaction, "id">[] = [
      {
        accountId: demoAccount.id,
        type: "deposit",
        amount: 2450.0,
        description: "Salary Deposit",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        transactionId: `TRX-${this.generateRandomTrxId()}`,
      },
      {
        accountId: demoAccount.id,
        type: "withdrawal",
        amount: -200.0,
        description: "ATM Withdrawal",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        transactionId: `TRX-${this.generateRandomTrxId()}`,
      },
      {
        accountId: demoAccount.id,
        type: "payment",
        amount: -85.23,
        description: "Bill Payment - Electricity",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        transactionId: `TRX-${this.generateRandomTrxId()}`,
      },
      {
        accountId: demoAccount.id,
        type: "deposit",
        amount: 650.0,
        description: "Deposit",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        transactionId: `TRX-${this.generateRandomTrxId()}`,
      },
    ];

    transactions.forEach((txn) => {
      const transaction: Transaction = {
        ...txn,
        id: this.transactionIdCounter++,
      };
      this.transactions.set(transaction.id, transaction);
    });
  }

  private generateRandomTrxId(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByCardNumber(cardNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.cardNumber === cardNumber,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async verifyPin(cardNumber: string, pin: string): Promise<boolean> {
    const user = await this.getUserByCardNumber(cardNumber);
    return user ? user.pin === pin : false;
  }

  async getAccount(userId: number): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find(
      (account) => account.userId === userId,
    );
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.accountIdCounter++;
    const now = new Date();
    const account: Account = { ...insertAccount, id, lastUpdated: now };
    this.accounts.set(id, account);
    return account;
  }

  async updateAccountBalance(
    accountId: number,
    newBalance: number,
  ): Promise<Account> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    const updatedAccount: Account = {
      ...account,
      balance: newBalance,
      lastUpdated: new Date(),
    };

    this.accounts.set(accountId, updatedAccount);
    return updatedAccount;
  }

  async getTransactions(accountId: number, limit = 10): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((txn) => txn.accountId === accountId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createTransaction(
    insertTransaction: InsertTransaction,
  ): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      timestamp: new Date(),
      transactionId:
        insertTransaction.transactionId || `TRX-${this.generateRandomTrxId()}`,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
}

// Initialize storage - use database if available, otherwise use memory
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage(process.env.DATABASE_URL)
  : new MemStorage();

// Initialize demo data if using database
async function initializeDemoData() {
    if (process.env.DATABASE_URL && storage instanceof DatabaseStorage) {
    try {
      // Check if demo user already exists
      const existingUser = await storage.getUserByCardNumber("4111111111111234");
      if (!existingUser) {
        // Create demo user
        const demoUser = await storage.createUser({
          username: "demo_user",
          password: "password",
          pin: "1234",
          cardNumber: "4111111111111234",
        });

        // Create demo account
        const demoAccount = await storage.createAccount({
          userId: demoUser.id,
          balance: "2547.63",
          availableCredit: "5000.00",
          withdrawalLimit: "1000.00",
        });

        // Add demo transactions
        const demoTransactions = [
          {
            accountId: demoAccount.id,
            type: "deposit",
            amount: "2450.00",
            description: "Salary Deposit",
            transactionId: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
          {
            accountId: demoAccount.id,
            type: "withdrawal",
            amount: "-200.00",
            description: "ATM Withdrawal",
            transactionId: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
          {
            accountId: demoAccount.id,
            type: "payment",
            amount: "-85.23",
            description: "Bill Payment - Electricity",
            transactionId: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
          {
            accountId: demoAccount.id,
            type: "deposit",
            amount: "650.00",
            description: "Deposit",
            transactionId: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
        ];

        for (const txn of demoTransactions) {
          await storage.createTransaction(txn);
        }

        console.log("Demo data initialized in database");
      }
    } catch (error) {
      console.error("Failed to initialize demo data:", error);
    }
  } else if (storage instanceof MemStorage){
        console.log("Demo data initialized in memory");
  }
}

// Initialize demo data
initializeDemoData();

let currentBalance = 2547.63;

export const store = {
  getAccountDetails(): AccountDetails {
    return {
      cardNumber: "**** **** **** 1234",
      balance: currentBalance,
      availableCredit: 5000.00,
      withdrawalLimit: 1000.00
    };
  },

  getBalance(): BalanceInquiry {
    return {
      balance: currentBalance,
      availableCredit: 5000.00,
      withdrawalLimit: 1000.00
    };
  },

  updateBalance(newBalance: number): void {
    currentBalance = newBalance;
  },
};