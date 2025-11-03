import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sandboxWallets = pgTable("sandbox_wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderType: varchar("order_type", { length: 4 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  isSandbox: boolean("is_sandbox").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderId: integer("order_id").references(() => orders.id),
  type: varchar("type", { length: 10 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 2 }).notNull(),
  total: decimal("total", { precision: 20, scale: 2 }).notNull(),
  isSandbox: boolean("is_sandbox").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const traderStats = pgTable("trader_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  totalTrades: integer("total_trades").default(0).notNull(),
  profitableTrades: integer("profitable_trades").default(0).notNull(),
  totalProfitLoss: decimal("total_profit_loss", { precision: 20, scale: 2 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portfolioSnapshots = pgTable("portfolio_snapshots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalValueUsd: decimal("total_value_usd", { precision: 20, scale: 2 }).notNull(),
  btcAmount: decimal("btc_amount", { precision: 20, scale: 8 }).default("0").notNull(),
  ethAmount: decimal("eth_amount", { precision: 20, scale: 8 }).default("0").notNull(),
  usdAmount: decimal("usd_amount", { precision: 20, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(3).max(100),
  passwordHash: z.string().min(8),
}).pick({
  email: true,
  username: true,
  passwordHash: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export const insertSandboxWalletSchema = createInsertSchema(sandboxWallets).omit({
  id: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders, {
  amount: z.string().refine((val) => parseFloat(val) > 0, "Amount must be positive"),
  price: z.string().refine((val) => parseFloat(val) > 0, "Price must be positive"),
}).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  status: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertTraderStatsSchema = createInsertSchema(traderStats).omit({
  id: true,
  updatedAt: true,
});

export const insertPortfolioSnapshotSchema = createInsertSchema(portfolioSnapshots).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;

export type InsertSandboxWallet = z.infer<typeof insertSandboxWalletSchema>;
export type SandboxWallet = typeof sandboxWallets.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertTraderStats = z.infer<typeof insertTraderStatsSchema>;
export type TraderStats = typeof traderStats.$inferSelect;

export type InsertPortfolioSnapshot = z.infer<typeof insertPortfolioSnapshotSchema>;
export type PortfolioSnapshot = typeof portfolioSnapshots.$inferSelect;
