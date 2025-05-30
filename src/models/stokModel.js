const db = require("../config/db");
const formatWIB = require("../utils/time");

class LaporanStok {
  static async getAllLaporanStok(tanggal = null) {
    const whereClauses = ["A.is_deleted = 0"];
    const values = [];
  
    if (tanggal) {
      if (tanggal.includes("_")) {
        const [start, end] = tanggal.split("_");
        whereClauses.push("DATE(A.created_at) BETWEEN ? AND ?");
        values.push(start, end);
      } else {
        whereClauses.push("DATE(A.created_at) = ?");
        values.push(tanggal);
      }
    }
  
    const query = `
      SELECT 
          A.id_laporan_stok,
          A.kode_laporan,
          B.nama_produk,
          A.perubahan_stok,
          A.alasan_perubahan,
          A.nama_karyawan,
          A.created_at,
          A.updated_at
      FROM tb_stok_produk A
      JOIN tb_produk B ON A.id_produk = B.id_produk
      WHERE ${whereClauses.join(" AND ")}
    `;
  
    const [rows] = await db.query(query, values);
  
    return rows.map(row => ({
      ...row,
      created_at: formatWIB(row.created_at),
      updated_at: formatWIB(row.updated_at),
    }));
  }

  static async createLaporanStok(p_kodeLaporan, p_idProduk, p_namaKaryawan, p_perubahanStok, p_alasanPerubahan) {
    const [result] = await db.query(
      "INSERT INTO tb_stok_produk (kode_laporan, id_produk, perubahan_stok, alasan_perubahan, nama_karyawan) VALUES (?, ?, ?, ?, ?)",
      [p_kodeLaporan, p_idProduk, p_perubahanStok, p_alasanPerubahan, p_namaKaryawan]
    );
    return result.insertId;
  }

  static async deleteLaporanStok(p_idLaporanStok) {
    await db.query("UPDATE tb_stok_produk SET is_deleted = 1, deleted_at = NOW() WHERE id_laporan_stok = ? AND is_deleted = 0", [p_idLaporanStok]);
  }
}

module.exports = LaporanStok;
