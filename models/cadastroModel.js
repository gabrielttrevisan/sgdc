import db from "../config/database.js";

class CadastroModel {
  
    static async findAll() {
    const [rows] = await db.query("SELECT * FROM donors")
    return rows
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM donors WHERE id=?", [id])
    return rows[0]
  }

  static async create(name, cpf, phone, gender) {
    const [result] = await db.query(
      "INSERT INTO donors (name, cpf, phone, gender) VALUES (?, ?, ?, ?)",
      [name, cpf, phone, gender]
    )
    return result
  }

  static async update(id, name, cpf, phone, gender) {
    const [result] = await db.query(
      "UPDATE donors SET name=?, cpf=?, phone=?, gender=? WHERE id= ?",
      [name, cpf, phone, gender, id]
    )
    return result
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM donors WHERE id=?", [id])
    return result
  }
}

export default CadastroModel;