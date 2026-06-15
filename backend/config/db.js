import mysql from "mysql2/promise";
import { env } from "./env.js";

/**
 * @typedef {Object} DatabaseConnInfo
 * @prop {string} host
 * @prop {number} port
 * @prop {string} database
 * @prop {string} user
 * @prop {string} pass
 */

class Database {
  /** @type {import("mysql2/promise").Pool} */
  #pool;
  /** @type {import("mysql2/promise").PoolOptions} */
  #info;

  /**
   * @param {DatabaseConnInfo} param0
   */
  constructor({ database, host, pass, user, port }) {
    this.#pool = null;
    this.#info = {
      host,
      port,
      user,
      password: pass,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 60000, 
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };
  }

  async connect() {
    if (!this.#pool) this.#pool = await mysql.createPool(this.#info);

    if (this.#pool.state === "disconnected") await this.#pool.connect();

    return await this.#pool.getConnection();
  }
}

const database = new Database({
  host: env.DB_HOST,
  database: env.DB_NAME,
  pass: env.DB_PASSWORD,
  user: env.DB_USER,
  port: env.DB_PORT,
});

export default database;
