const db = require("../config/db");

class Suppliers {
  static async getAllSuppliers() {
    const [rows] = await db.query("SELECT id_suppliers, nama_suppliers, contact_person, contact_suppliers, email_suppliers, alamat_suppliers, created_at, updated_at FROM tb_suppliers");
    return rows;
  }

  static async createSuppliers(p_namaSuppliers, p_contactPerson, p_contactSuppliers, p_emailSuppliers, p_alamatSuppliers) {
    const [result] = await db.query(
      "INSERT INTO tb_suppliers (nama_suppliers, contact_person, contact_suppliers, email_suppliers, alamat_suppliers) VALUES (?, ?, ?, ?, ?)",
      [p_namaSuppliers, p_contactPerson, p_contactSuppliers, p_emailSuppliers, p_alamatSuppliers]
    );
    return result.insertId;
  }

  static async updateSuppliers(p_idSuppliers, p_namaSuppliers, p_contactPerson, p_contactSuppliers, p_emailSuppliers, p_alamatSuppliers) {
    await db.query(
      "UPDATE tb_suppliers SET nama_suppliers = ?, contact_person = ?, contact_suppliers = ?, email_suppliers = ?, alamat_suppliers = ? WHERE id_suppliers = ?",
      [p_namaSuppliers, p_contactPerson, p_contactSuppliers, p_emailSuppliers, p_alamatSuppliers, p_idSuppliers]
    );
  }

  static async deleteSuppliers(p_idSuppliers) {
    await db.query("DELETE FROM tb_suppliers WHERE id_suppliers = ?", [p_idSuppliers]);
  }
}

module.exports = Suppliers;
