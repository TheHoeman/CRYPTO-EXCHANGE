import { db, pool } from './db';
import { sql } from 'drizzle-orm';
import {
  users,
  wallets,
  sandboxWallets,
  orders,
  transactions,
  traderStats,
  portfolioSnapshots,
} from '@shared/schema';

async function migrate() {
  console.log('Running migrations...');

  try {
    await db.execute(sql`DROP TABLE IF EXISTS portfolio_snapshots CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS trader_stats CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS transactions CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS orders CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sandbox_wallets CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS wallets CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    await db.execute(sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE sandbox_wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        balance DECIMAL(20, 8) DEFAULT 0 NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        order_type VARCHAR(4) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        amount DECIMAL(20, 8) NOT NULL,
        price DECIMAL(20, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
        is_sandbox BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        completed_at TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        order_id INTEGER REFERENCES orders(id),
        type VARCHAR(10) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        amount DECIMAL(20, 8) NOT NULL,
        price DECIMAL(20, 2) NOT NULL,
        total DECIMAL(20, 2) NOT NULL,
        is_sandbox BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE trader_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE,
        username VARCHAR(100) NOT NULL,
        total_trades INTEGER DEFAULT 0 NOT NULL,
        profitable_trades INTEGER DEFAULT 0 NOT NULL,
        total_profit_loss DECIMAL(20, 2) DEFAULT 0 NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE portfolio_snapshots (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        total_value_usd DECIMAL(20, 2) NOT NULL,
        btc_amount DECIMAL(20, 8) DEFAULT 0 NOT NULL,
        eth_amount DECIMAL(20, 8) DEFAULT 0 NOT NULL,
        usd_amount DECIMAL(20, 2) DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`CREATE INDEX idx_wallets_user_id ON wallets(user_id)`);
    await db.execute(sql`CREATE INDEX idx_sandbox_wallets_user_id ON sandbox_wallets(user_id)`);
    await db.execute(sql`CREATE INDEX idx_orders_user_id ON orders(user_id)`);
    await db.execute(sql`CREATE INDEX idx_orders_status ON orders(status)`);
    await db.execute(sql`CREATE INDEX idx_transactions_user_id ON transactions(user_id)`);
    await db.execute(sql`CREATE INDEX idx_portfolio_snapshots_user_id ON portfolio_snapshots(user_id)`);

    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate();
