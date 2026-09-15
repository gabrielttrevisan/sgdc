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

  static async findByCPF(cpf) {
    const cleanedCpf = cpf.replace(/\D/g, "")
    const [rows] = await db.query(
      "SELECT * FROM donors WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = ?",
      [cleanedCpf]
    )
    return rows[0]
  }

  static async findByCPFExcludingId(cpf, id) {
    const cleanedCpf = cpf.replace(/\D/g, "")
    const [rows] = await db.query(
      "SELECT * FROM donors WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = ? AND id != ?",
      [cleanedCpf, id]
    )
    return rows[0]
  }

  static async create(name, cpf, phone, gender, email, age) {
    const [result] = await db.query(
      "INSERT INTO donors (name, cpf, phone, gender, email, age) VALUES (?, ?, ?, ?, ?, ?)",
      [name, cpf, phone, gender, email, age]
    )
    return result
  }

  static async update(id, name, cpf, phone, gender, email, age) {
    const [result] = await db.query(
      "UPDATE donors SET name=?, cpf=?, phone=?, gender=?, email=?, age=? WHERE id= ?",
      [name, cpf, phone, gender, email, age, id]
    )
    return result
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM donors WHERE id=?", [id])
    return result
  }
}

export default CadastroModel;