import database from "../../config/db.js";

class SqlFragment {
  /** @type {string} */
  #sql = "";
  /** @type {Array.<any>} */
  #params = [];
  /** @type {import("mysql2").Connection} */
  #conn = null;

  /**
   * @param {string} sql
   * @param {Array.<any>} params
   * @param {import("mysql2").Connection} [conn]
   */
  constructor(sql, params, conn = null) {
    this.#sql = sql;
    this.#params = params;
    this.#conn = conn;
  }

  /**
   * @param {Array.<string>} raw
   * @param  {...any} values
   * @returns {SqlFragment}
   */
  static from(strings, ...values) {
    const query = new SqlFragment();
    const params = [];
    let raw = "";

    strings.forEach((str, i) => {
      const value = values[i];

      if (value instanceof SqlFragment) {
        raw += str + value.#sql;
        params.push(...value.#params);
      } else if (value !== undefined) {
        raw += str + "?";
        params.push(value);
      } else {
        raw += str;
      }
    });

    query.#params = params;
    query.#sql = raw;

    return query;
  }

  get sql() {
    return this.#sql;
  }

  get params() {
    return this.#params;
  }

  get isEmpty() {
    return this.#params.length === 0 && this.#sql === "";
  }

  get connection() {
    return this.#conn;
  }

  static get empty() {
    return SqlFragment.from``;
  }

  async run() {
    throw new Error("Sql is not and executable");
  }

  /**
   * @param {string|null|undefined} step
   * @param  {...SqlFragment} fragments
   */
  static join(sep, ...fragments) {
    const nonEmpty = fragments.filter((fragment) => !fragment.isEmpty);

    const joined = nonEmpty.reduce(
      ({ params, sql }, fragment) => ({
        params: [...params, ...fragment.params],
        sql: sql ? sql + (sep ?? " ") + fragment.sql : fragment.sql,
      }),
      { params: [], sql: "" },
    );

    return new SqlFragment(joined.sql, joined.params);
  }

  /**
   * @param {function(SqlFunctor): Promise<boolean>} callback
   * @returns {Promise<[boolean, Error|null]>}
   */
  static async transaction(callback) {
    const connection = await database.connect();

    try {
      await connection.beginTransaction();

      const sqlFunctor = createSQLFunctor(connection);

      const shouldCommit = await callback(sqlFunctor);

      if (shouldCommit) await connection.commit();
      else await connection.rollback();

      return [shouldCommit, null];
    } catch (e) {
      await connection.rollback();
      return [false, e];
    }
  }
}

class SqlExecutable extends SqlFragment {
  /**
   * @param {string} sql
   * @param {Array.<any>} params
   * @param {import("mysql2").Connection} [conn]
   */
  constructor(sql, params, conn) {
    super(sql, params, conn);
  }

  async run() {
    if (this.connection) {
      const [result] = await this.connection.execute(this.sql, this.params);

      return result;
    } else {
      const conn = await database.connect();
      const [result] = await conn.execute(this.sql, this.params);

      conn.release();

      return result;
    }
  }
}

class SqlQuery extends SqlFragment {
  /**
   * @param {string} sql
   * @param {Array.<any>} params
   * @param {import("mysql2").Connection} [conn]
   */
  constructor(sql, params, conn) {
    super(sql, params, conn);
  }

  async run() {
    if (this.connection) {
      const [result] = await this.connection.query(this.sql, this.params);

      return result;
    } else {
      const conn = await database.connect();
      const [result] = await conn.query(this.sql, this.params);

      conn.release();

      return result;
    }
  }
}

/**
 * @typedef {object} SqlFunctor
 * @property {(strings: TemplateStringsArray, ...values: any[]) => SqlFragment}
 * @property {function(string): SqlFragment} str
 * @property {SqlFragment} empty
 * @property {function(string, ...string): SqlFragment} join
 * @property {(strings: TemplateStringsArray, ...values: any[]) => SqlQuery} query
 * @property {(strings: TemplateStringsArray, ...values: any[]) => SqlExecutable} exec
 */

/**
 * @param {import("mysql2").Connection} [conn]
 */
function createSQLFunctor(conn = null) {
  const sqlFunctor = function sql(strings, ...values) {
    return SqlFragment.from(strings, ...values);
  };

  Object.defineProperty(sqlFunctor, "str", {
    value: (value) => SqlFragment.from([value]),
  });

  Object.defineProperty(sqlFunctor, "empty", {
    get() {
      return SqlFragment.empty;
    },
  });

  Object.defineProperty(sqlFunctor, "join", {
    value: SqlFragment.join,
  });

  Object.defineProperty(sqlFunctor, "query", {
    value:
      /**
       * @param {Array.<string>} strings
       * @param  {...any} values
       * @returns {SqlQuery}
       */
      (strings, ...values) => {
        const frag = SqlFragment.from(strings, ...values);

        return new SqlQuery(frag.sql, frag.params, conn);
      },
  });

  Object.defineProperty(sqlFunctor, "exec", {
    value:
      /**
       * @param {Array.<string>} strings
       * @param  {...any} values
       * @returns {SqlExecutable}
       */
      (strings, ...values) => {
        const frag = SqlFragment.from(strings, ...values);

        return new SqlExecutable(frag.sql, frag.params, conn);
      },
  });

  return sqlFunctor;
}

/** @type {SqlFunctor} */
const sql = createSQLFunctor();

export default sql;

/**
 * @param {function(SqlFunctor): Promise<boolean>} callback
 */
export async function transaction(callback) {
  return SqlFragment.transaction(callback);
}
