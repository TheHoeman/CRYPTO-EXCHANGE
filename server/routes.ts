import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { users, wallets, sandboxWallets, orders, transactions, traderStats } from "@shared/schema";
import { eq, and, desc, sql, ne } from "drizzle-orm";
import { hashPassword, verifyPassword, generateToken, authMiddleware, validatePassword, type AuthRequest } from "./auth";
import { fetchCryptoPrices, getCachedPrices, startPricePolling } from "./services/cryptoService";
import { matchOrder } from "./services/orderMatcher";

export async function registerRoutes(app: Express): Promise<Server> {
  startPricePolling(30000);

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.error });
      }

      const existingUser = await db.query.users.findFirst({
        where: (users, { or, eq }) => or(eq(users.email, email), eq(users.username, username))
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email or username already exists" });
      }

      const passwordHash = await hashPassword(password);
      
      const [user] = await db.insert(users).values({
        email,
        username,
        passwordHash,
      }).returning();

      await db.insert(wallets).values([
        { userId: user.id, currency: "USD", balance: "10000" },
        { userId: user.id, currency: "BTC", balance: "0" },
        { userId: user.id, currency: "ETH", balance: "0" },
      ]);

      await db.insert(sandboxWallets).values([
        { userId: user.id, currency: "USD", balance: "10000" },
        { userId: user.id, currency: "BTC", balance: "0" },
        { userId: user.id, currency: "ETH", balance: "0" },
      ]);

      await db.insert(traderStats).values({
        userId: user.id,
        username: user.username,
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await verifyPassword(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.user!.userId),
        columns: { id: true, email: true, username: true, createdAt: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.get("/api/prices", async (req, res) => {
    try {
      const prices = getCachedPrices();
      res.json(prices);
    } catch (error) {
      console.error("Get prices error:", error);
      res.status(500).json({ error: "Failed to get prices" });
    }
  });

  app.get("/api/wallet/balance", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { sandbox } = req.query;
      const isSandbox = sandbox === "true";

      const walletData = isSandbox
        ? await db.query.sandboxWallets.findMany({
            where: eq(sandboxWallets.userId, req.user!.userId),
          })
        : await db.query.wallets.findMany({
            where: eq(wallets.userId, req.user!.userId),
          });

      res.json({ wallets: walletData });
    } catch (error) {
      console.error("Get balance error:", error);
      res.status(500).json({ error: "Failed to get balance" });
    }
  });

  app.post("/api/wallet/deposit", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { currency, amount, sandbox } = req.body;
      const isSandbox = sandbox === true;

      if (!currency || !amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: "Invalid currency or amount" });
      }

      if (isSandbox) {
        const [wallet] = await db.select()
          .from(sandboxWallets)
          .where(and(
            eq(sandboxWallets.userId, req.user!.userId),
            eq(sandboxWallets.currency, currency)
          ));

        if (!wallet) {
          return res.status(404).json({ error: "Wallet not found" });
        }

        const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toFixed(8);
        await db.update(sandboxWallets)
          .set({ balance: newBalance, updatedAt: new Date() })
          .where(eq(sandboxWallets.id, wallet.id));
      } else {
        const [wallet] = await db.select()
          .from(wallets)
          .where(and(
            eq(wallets.userId, req.user!.userId),
            eq(wallets.currency, currency)
          ));

        if (!wallet) {
          return res.status(404).json({ error: "Wallet not found" });
        }

        const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toFixed(8);
        await db.update(wallets)
          .set({ balance: newBalance })
          .where(eq(wallets.id, wallet.id));
      }

      res.json({ success: true, message: "Deposit successful" });
    } catch (error) {
      console.error("Deposit error:", error);
      res.status(500).json({ error: "Deposit failed" });
    }
  });

  app.post("/api/wallet/withdraw", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { currency, amount, sandbox } = req.body;
      const isSandbox = sandbox === true;

      if (!currency || !amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: "Invalid currency or amount" });
      }

      if (isSandbox) {
        const [wallet] = await db.select()
          .from(sandboxWallets)
          .where(and(
            eq(sandboxWallets.userId, req.user!.userId),
            eq(sandboxWallets.currency, currency)
          ));

        if (!wallet) {
          return res.status(404).json({ error: "Wallet not found" });
        }

        if (parseFloat(wallet.balance) < parseFloat(amount)) {
          return res.status(400).json({ error: "Insufficient balance" });
        }

        const newBalance = (parseFloat(wallet.balance) - parseFloat(amount)).toFixed(8);
        await db.update(sandboxWallets)
          .set({ balance: newBalance, updatedAt: new Date() })
          .where(eq(sandboxWallets.id, wallet.id));
      } else {
        const [wallet] = await db.select()
          .from(wallets)
          .where(and(
            eq(wallets.userId, req.user!.userId),
            eq(wallets.currency, currency)
          ));

        if (!wallet) {
          return res.status(404).json({ error: "Wallet not found" });
        }

        if (parseFloat(wallet.balance) < parseFloat(amount)) {
          return res.status(400).json({ error: "Insufficient balance" });
        }

        const newBalance = (parseFloat(wallet.balance) - parseFloat(amount)).toFixed(8);
        await db.update(wallets)
          .set({ balance: newBalance })
          .where(eq(wallets.id, wallet.id));
      }

      res.json({ success: true, message: "Withdrawal successful" });
    } catch (error) {
      console.error("Withdrawal error:", error);
      res.status(500).json({ error: "Withdrawal failed" });
    }
  });

  app.get("/api/transactions/history", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { page = "1", limit = "10", currency, sandbox } = req.query;
      const isSandbox = sandbox === "true";
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let query = db.select()
        .from(transactions)
        .where(and(
          eq(transactions.userId, req.user!.userId),
          eq(transactions.isSandbox, isSandbox),
          currency ? eq(transactions.currency, currency as string) : undefined
        ))
        .orderBy(desc(transactions.createdAt))
        .limit(parseInt(limit as string))
        .offset(offset);

      const txList = await query;
      
      const [countResult] = await db.select({ count: sql<number>`count(*)::int` })
        .from(transactions)
        .where(and(
          eq(transactions.userId, req.user!.userId),
          eq(transactions.isSandbox, isSandbox),
          currency ? eq(transactions.currency, currency as string) : undefined
        ));

      const totalCount = countResult.count;
      const totalPages = Math.ceil(totalCount / parseInt(limit as string));

      res.json({
        transactions: txList,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages,
          totalCount,
        },
      });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: "Failed to get transactions" });
    }
  });

  app.post("/api/orders/create", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { orderType, currency, amount, price, sandbox } = req.body;
      const isSandbox = sandbox === true;

      if (!orderType || !currency || !amount || !price) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (parseFloat(amount) <= 0 || parseFloat(price) <= 0) {
        return res.status(400).json({ error: "Amount and price must be positive" });
      }

      const minAmount = currency === "BTC" ? 0.001 : 0.01;
      if (parseFloat(amount) < minAmount) {
        return res.status(400).json({ 
          error: `Minimum trade amount is ${minAmount} ${currency}` 
        });
      }

      const walletTable = isSandbox ? sandboxWallets : wallets;
      
      if (orderType === "BUY") {
        const [usdWallet] = await db.select()
          .from(walletTable)
          .where(and(
            eq(walletTable.userId, req.user!.userId),
            eq(walletTable.currency, "USD")
          ));

        if (!usdWallet) {
          return res.status(404).json({ error: "USD wallet not found" });
        }

        const total = parseFloat(amount) * parseFloat(price);
        if (parseFloat(usdWallet.balance) < total) {
          return res.status(400).json({ error: "Insufficient USD balance" });
        }
      } else {
        const [cryptoWallet] = await db.select()
          .from(walletTable)
          .where(and(
            eq(walletTable.userId, req.user!.userId),
            eq(walletTable.currency, currency)
          ));

        if (!cryptoWallet) {
          return res.status(404).json({ error: `${currency} wallet not found` });
        }

        if (parseFloat(cryptoWallet.balance) < parseFloat(amount)) {
          return res.status(400).json({ error: `Insufficient ${currency} balance` });
        }
      }

      const [order] = await db.insert(orders).values({
        userId: req.user!.userId,
        orderType,
        currency,
        amount,
        price,
        isSandbox,
      }).returning();

      setImmediate(() => {
        matchOrder(order.id);
      });

      res.json({ order, message: "Order created successfully" });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/active", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { sandbox } = req.query;
      const isSandbox = sandbox === "true";

      const activeOrders = await db.select()
        .from(orders)
        .where(and(
          eq(orders.userId, req.user!.userId),
          eq(orders.status, "PENDING"),
          eq(orders.isSandbox, isSandbox)
        ))
        .orderBy(desc(orders.createdAt));

      res.json({ orders: activeOrders });
    } catch (error) {
      console.error("Get active orders error:", error);
      res.status(500).json({ error: "Failed to get active orders" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const topTraders = await db.select()
        .from(traderStats)
        .orderBy(desc(traderStats.totalProfitLoss))
        .limit(100);

      const leaderboard = topTraders.map((trader, index) => ({
        id: trader.id,
        rank: index + 1,
        username: trader.username,
        totalTrades: trader.totalTrades,
        winRate: trader.totalTrades > 0 
          ? ((trader.profitableTrades / trader.totalTrades) * 100).toFixed(1)
          : "0.0",
        profitLoss: parseFloat(trader.totalProfitLoss),
        profitPercent: (parseFloat(trader.totalProfitLoss) / 100).toFixed(2),
      }));

      res.json({ leaderboard });
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.post("/api/sandbox/reset", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.update(sandboxWallets)
        .set({ balance: "10000", updatedAt: new Date() })
        .where(and(
          eq(sandboxWallets.userId, req.user!.userId),
          eq(sandboxWallets.currency, "USD")
        ));

      await db.update(sandboxWallets)
        .set({ balance: "0", updatedAt: new Date() })
        .where(and(
          eq(sandboxWallets.userId, req.user!.userId),
          ne(sandboxWallets.currency, "USD")
        ));

      res.json({ success: true, message: "Sandbox balance reset to $10,000" });
    } catch (error) {
      console.error("Reset sandbox error:", error);
      res.status(500).json({ error: "Failed to reset sandbox" });
    }
  });

  app.get("/api/portfolio/history", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { range = "7d", sandbox } = req.query;
      const isSandbox = sandbox === "true";
      
      const rangeMap: { [key: string]: number } = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365,
      };
      
      const days = rangeMap[range as string] || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const userTransactions = await db.select()
        .from(transactions)
        .where(and(
          eq(transactions.userId, req.user!.userId),
          eq(transactions.isSandbox, isSandbox)
        ))
        .orderBy(transactions.createdAt);

      const walletTable = isSandbox ? sandboxWallets : wallets;
      const currentWallets = await db.select()
        .from(walletTable)
        .where(eq(walletTable.userId, req.user!.userId));

      const prices = getCachedPrices();
      
      const btcWallet = currentWallets.find(w => w.currency === "BTC");
      const ethWallet = currentWallets.find(w => w.currency === "ETH");
      const usdWallet = currentWallets.find(w => w.currency === "USD");
      
      const currentBtcValue = btcWallet ? parseFloat(btcWallet.balance) * prices.btc : 0;
      const currentEthValue = ethWallet ? parseFloat(ethWallet.balance) * prices.eth : 0;
      const currentUsdValue = usdWallet ? parseFloat(usdWallet.balance) : 0;
      const currentTotalValue = currentBtcValue + currentEthValue + currentUsdValue;

      const dataPoints = [];
      const startingValue = 10000;

      if (userTransactions.length === 0) {
        for (let i = 0; i <= days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          dataPoints.push({
            date: date.toISOString(),
            value: i === days ? currentTotalValue : startingValue,
          });
        }
      } else {
        const firstTxDate = new Date(userTransactions[0].createdAt);
        const daysSinceFirstTx = Math.ceil((new Date().getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24));
        const relevantDays = Math.min(days, daysSinceFirstTx);
        
        for (let i = 0; i <= relevantDays; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (relevantDays - i));
          
          const progress = i / relevantDays;
          const interpolatedValue = startingValue + (currentTotalValue - startingValue) * progress;
          
          dataPoints.push({
            date: date.toISOString(),
            value: interpolatedValue,
          });
        }
      }

      res.json({ history: dataPoints });
    } catch (error) {
      console.error("Get portfolio history error:", error);
      res.status(500).json({ error: "Failed to get portfolio history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
