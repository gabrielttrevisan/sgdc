import database from "../../config/db.js";

class SqlFragment {
  /** @type {string} */
  #sql = "";
  /** @type {Array.<any>} */
  #params = [];

  /**
   * @param {string} sql
   * @param {Array.<any>} params
   */
  constructor(sql, params) {
    this.#sql = sql;
    this.#params = params;
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

  static get empty() {
    return SqlFragment.from``;
  }

  async run() {
    throw new Error("Sql is not and executable");
  }
}

class SqlExecutable extends SqlFragment {
  /**
   * @param {string} sql
   * @param {Array.<any>} params
   */
  constructor(sql, params) {
    super(sql, params);
  }

  async run() {
    const conn = await database.connect();
    const [result] = await conn.execute(this.sql, this.params);

    conn.release();

    return result;
  }
}

class SqlQuery extends SqlFragment {
  /**
   * @param {string} sql
   * @param {Array.<any>} params
   */
  constructor(sql, params) {
    super(sql, params);
  }

  async run() {
    const conn = await database.connect();
    const [result] = await conn.query(this.sql, this.params);

    conn.release();

    return result;
  }
}

export default function sql(strings, ...values) {
  return SqlFragment.from(strings, ...values);
}

Object.defineProperty(sql, "empty", {
  get() {
    return SqlFragment.empty;
  },
});

Object.defineProperty(sql, "query", {
  value:
    /**
     * @param {Array.<string>} strings
     * @param  {...any} values
     * @returns {SqlQuery}
     */
    (strings, ...values) => {
      const frag = SqlFragment.from(strings, ...values);

      return new SqlQuery(frag.sql, frag.params);
    },
});

Object.defineProperty(sql, "exec", {
  value:
    /**
     * @param {Array.<string>} strings
     * @param  {...any} values
     * @returns {SqlExecutable}
     */
    (strings, ...values) => {
      const frag = SqlFragment.from(strings, ...values);

      return new SqlExecutable(frag.sql, frag.params);
    },
});
