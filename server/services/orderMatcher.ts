import { db } from "../db";
import { orders, wallets, sandboxWallets, transactions, traderStats } from "@shared/schema";
import { eq, and, ne, sql, desc } from "drizzle-orm";

export async function matchOrder(orderId: number) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order || order.status !== "PENDING") {
      return;
    }

    const oppositeType = order.orderType === "BUY" ? "SELL" : "BUY";
    
    const matchingOrders = await db.select()
      .from(orders)
      .where(and(
        eq(orders.currency, order.currency),
        eq(orders.orderType, oppositeType),
        eq(orders.status, "PENDING"),
        eq(orders.isSandbox, order.isSandbox),
        ne(orders.userId, order.userId)
      ))
      .orderBy(
        order.orderType === "BUY" ? orders.price : desc(orders.price),
        orders.createdAt
      )
      .limit(10);

    for (const matchingOrder of matchingOrders) {
      const buyOrder = order.orderType === "BUY" ? order : matchingOrder;
      const sellOrder = order.orderType === "SELL" ? order : matchingOrder;

      if (parseFloat(buyOrder.price) >= parseFloat(sellOrder.price)) {
        const matchAmount = Math.min(
          parseFloat(order.amount),
          parseFloat(matchingOrder.amount)
        );
        const matchPrice = parseFloat(sellOrder.price);
        const matchTotal = matchAmount * matchPrice;

        const walletTable = order.isSandbox ? sandboxWallets : wallets;

        const [buyerCryptoWallet] = await db.select()
          .from(walletTable)
          .where(and(
            eq(walletTable.userId, buyOrder.userId),
            eq(walletTable.currency, order.currency)
          ));

        const [buyerUsdWallet] = await db.select()
          .from(walletTable)
          .where(and(
            eq(walletTable.userId, buyOrder.userId),
            eq(walletTable.currency, "USD")
          ));

        const [sellerCryptoWallet] = await db.select()
          .from(walletTable)
          .where(and(
            eq(walletTable.userId, sellOrder.userId),
            eq(walletTable.currency, order.currency)
          ));

        const [sellerUsdWallet] = await db.select()
          .from(walletTable)
          .where(and(
            eq(walletTable.userId, sellOrder.userId),
            eq(walletTable.currency, "USD")
          ));

        if (!buyerCryptoWallet || !buyerUsdWallet || !sellerCryptoWallet || !sellerUsdWallet) {
          console.error("Wallet not found for users");
          continue;
        }

        if (parseFloat(buyerUsdWallet.balance) < matchTotal) {
          console.error("Buyer insufficient USD balance");
          continue;
        }

        if (parseFloat(sellerCryptoWallet.balance) < matchAmount) {
          console.error("Seller insufficient crypto balance");
          continue;
        }

        await db.update(walletTable)
          .set({ balance: (parseFloat(buyerCryptoWallet.balance) + matchAmount).toFixed(8) })
          .where(eq(walletTable.id, buyerCryptoWallet.id));

        await db.update(walletTable)
          .set({ balance: (parseFloat(buyerUsdWallet.balance) - matchTotal).toFixed(2) })
          .where(eq(walletTable.id, buyerUsdWallet.id));

        await db.update(walletTable)
          .set({ balance: (parseFloat(sellerCryptoWallet.balance) - matchAmount).toFixed(8) })
          .where(eq(walletTable.id, sellerCryptoWallet.id));

        await db.update(walletTable)
          .set({ balance: (parseFloat(sellerUsdWallet.balance) + matchTotal).toFixed(2) })
          .where(eq(walletTable.id, sellerUsdWallet.id));

        await db.insert(transactions).values([
          {
            userId: buyOrder.userId,
            orderId: buyOrder.id,
            type: "BUY",
            currency: order.currency,
            amount: matchAmount.toFixed(8),
            price: matchPrice.toFixed(2),
            total: matchTotal.toFixed(2),
            isSandbox: order.isSandbox,
          },
          {
            userId: sellOrder.userId,
            orderId: sellOrder.id,
            type: "SELL",
            currency: order.currency,
            amount: matchAmount.toFixed(8),
            price: matchPrice.toFixed(2),
            total: matchTotal.toFixed(2),
            isSandbox: order.isSandbox,
          },
        ]);

        const newOrderAmount = parseFloat(order.amount) - matchAmount;
        const newMatchingOrderAmount = parseFloat(matchingOrder.amount) - matchAmount;

        if (newOrderAmount <= 0.00000001) {
          await db.update(orders)
            .set({ status: "COMPLETED", completedAt: new Date(), amount: "0" })
            .where(eq(orders.id, order.id));
        } else {
          await db.update(orders)
            .set({ amount: newOrderAmount.toFixed(8) })
            .where(eq(orders.id, order.id));
        }

        if (newMatchingOrderAmount <= 0.00000001) {
          await db.update(orders)
            .set({ status: "COMPLETED", completedAt: new Date(), amount: "0" })
            .where(eq(orders.id, matchingOrder.id));
        } else {
          await db.update(orders)
            .set({ amount: newMatchingOrderAmount.toFixed(8) })
            .where(eq(orders.id, matchingOrder.id));
        }

        if (!order.isSandbox) {
          await updateTraderStats(buyOrder.userId, matchTotal, true);
          await updateTraderStats(sellOrder.userId, matchTotal, false);
        }

        if (newOrderAmount <= 0.00000001) {
          break;
        }
      }
    }
  } catch (error) {
    console.error("Order matching error:", error);
  }
}

async function updateTraderStats(userId: number, tradeValue: number, isBuy: boolean) {
  try {
    const stats = await db.query.traderStats.findFirst({
      where: eq(traderStats.userId, userId),
    });

    if (stats) {
      await db.update(traderStats)
        .set({
          totalTrades: stats.totalTrades + 1,
          updatedAt: new Date(),
        })
        .where(eq(traderStats.userId, userId));
    }
  } catch (error) {
    console.error("Update trader stats error:", error);
  }
}
