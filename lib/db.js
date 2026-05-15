import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'strefastartu.pl',
  user: process.env.DB_USER || 'noded',
  password: process.env.DB_PASSWORD || 'farmerek1',
  database: process.env.DB_NAME || 'strefastartu',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Singleton pool
let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}
