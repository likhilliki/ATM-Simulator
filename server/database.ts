
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { users, accounts, transactions } from "../shared/schema";
import type {
  User,
  InsertUser,
  Account,
  InsertAccount,
  Transaction,
  InsertTransaction,
} from "../shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(databaseUrl: string) {
    const sql = postgres(databaseUrl);
    this.db = drizzle(sql);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async getUserByCardNumber(cardNumber: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.cardNumber, cardNumber))
      .limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(user)
      .returning();
    return result[0];
  }

  async verifyPin(cardNumber: string, pin: string): Promise<boolean> {
    const user = await this.getUserByCardNumber(cardNumber);
    return user ? user.pin === pin : false;
  }

  async getAccount(userId: number): Promise<Account | undefined> {
    const result = await this.db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .limit(1);
    return result[0];
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const result = await this.db
      .insert(accounts)
      .values(account)
      .returning();
    return result[0];
  }

  async updateAccountBalance(accountId: number, newBalance: number): Promise<Account> {
    const result = await this.db
      .update(accounts)
      .set({ 
        balance: newBalance.toString(),
        lastUpdated: new Date()
      })
      .where(eq(accounts.id, accountId))
      .returning();
    
    if (!result[0]) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    
    return result[0];
  }

  async getTransactions(accountId: number, limit = 10): Promise<Transaction[]> {
    const result = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId))
      .orderBy(transactions.timestamp)
      .limit(limit);
    return result;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await this.db
      .insert(transactions)
      .values(transaction)
      .returning();
    return result[0];
  }
}
