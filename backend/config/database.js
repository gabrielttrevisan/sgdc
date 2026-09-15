import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

export async function initializeDatabase() {
  await promisePool.query(`
    CREATE TABLE IF NOT EXISTS PRODUCTS (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      NAME VARCHAR(120) NOT NULL,
      DESCRIPTION TEXT,
      PRICE DECIMAL(10,2) NOT NULL,
      STOCK INT NOT NULL,
      STATUS VARCHAR(20) DEFAULT 'ACTIVE'
    )
  `);
}

export default promisePool;