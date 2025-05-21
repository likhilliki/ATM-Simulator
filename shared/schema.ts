import { pgTable, text, serial, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  pin: text("pin").notNull(),
  cardNumber: text("card_number").notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  availableCredit: numeric("available_credit", { precision: 10, scale: 2 }).notNull().default("0"),
  withdrawalLimit: numeric("withdrawal_limit", { precision: 10, scale: 2 }).notNull().default("0"),
  lastUpdated: timestamp("last_updated").defaultNow()
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: serial("account_id").references(() => accounts.id),
  type: text("type").notNull(), // withdrawal, deposit, transfer, etc.
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
  transactionId: text("transaction_id").notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  pin: true,
  cardNumber: true,
});

export const insertAccountSchema = createInsertSchema(accounts).pick({
  userId: true,
  balance: true,
  availableCredit: true,
  withdrawalLimit: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  accountId: true,
  type: true,
  amount: true,
  description: true,
  transactionId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Validations
export const pinSchema = z.string().length(4).regex(/^\d+$/, "PIN must contain only digits");
export const amountSchema = z.number()
  .positive("Amount must be positive")
  .multipleOf(20, "Amount must be in multiples of $20")
  .max(1000, "Maximum withdrawal amount is $1000");
