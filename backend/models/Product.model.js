import db from "../config/database.js";

class Product {
  static async findAll(name = "") {
    let query = `
            SELECT *
            FROM PRODUCTS
        `;

    const values = [];

    if (name) {
      query += ` WHERE NAME LIKE ?`;
      values.push(`%${name}%`);
    }

    const [rows] = await db.query(query, values);

    return rows;
  }

  static async create(data) {
    const query = `
            INSERT INTO PRODUCTS
                (NAME, DESCRIPTION, PRICE, STOCK, STATUS)
            VALUES (?, ?, ?, ?, ?)
        `;

    const values = [
      data.name,
      data.description,
      data.price,
      data.stock,
      data.status,
    ];

    const [result] = await db.query(query, values);

    return result;
  }

  static async update(id, data) {
    const query = `
            UPDATE PRODUCTS
            SET
                NAME = ?,
                DESCRIPTION = ?,
                PRICE = ?,
                STOCK = ?,
                STATUS = ?
            WHERE ID = ?
        `;

    const values = [
      data.name,
      data.description,
      data.price,
      data.stock,
      data.status,
      id,
    ];

    const [result] = await db.query(query, values);

    return result;
  }

  static async delete(id) {
    const query = `
            DELETE FROM PRODUCTS
            WHERE ID = ?
        `;

    const [result] = await db.query(query, [id]);

    return result;
  }
}

export default Product;
