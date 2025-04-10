const db = require("../config/db");
const formatWIB = require("../utils/time");

class Produk {
  static async getAllProduk() {
    const [rows] = await db.query(`
      SELECT 
        p.id_produk, 
        k.id_kategori,
        sk.id_subkategori,
        k.nama_kategori,
        sk.nama_subkategori,
        p.nama_produk, 
        p.sku_produk, 
        p.barcode_produk, 
        p.deskripsi_produk, 
        p.harga_produk,
        p.modal_produk,
        p.diskon_produk,
        p.stok_produk,
        p.stok_minimum_produk,
        p.status_produk,
        p.gambar_produk,
        p.created_at,
        p.updated_at
      FROM tb_produk p
      JOIN tb_subkategori sk ON p.id_kategori = sk.id_subkategori
      JOIN tb_kategori k ON sk.id_kategori = k.id_kategori
    `);
  
    // Mapping agar kategori jadi array sesuai permintaan
    return rows.map(row => ({
      id_produk: row.id_produk,
      kategori: [{
        id_kategori: row.id_kategori,
        id_subkategori: row.id_subkategori,
        nama_kategori: row.nama_kategori,
        nama_subkategori: row.nama_subkategori,
      }],
      nama_produk: row.nama_produk,
      sku_produk: row.sku_produk,
      barcode_produk: row.barcode_produk,
      deskripsi_produk: row.deskripsi_produk,
      harga_produk: row.harga_produk,
      modal_produk: row.modal_produk,
      diskon_prpduk: row.diskon_produk,
      stok_produk: row.stok_produk,
      stok_minimum_produk: row.stok_minimum_produk,
      status_produk: row.status_produk,
      gambar_produk: row.gambar_produk,
      created_at: formatWIB(row.created_at),
      updated_at: formatWIB(row.updated_at),
    }));
  }

  static async getProdukByID(p_idProduk) {
    const [rows] = await db.query(`
      SELECT 
        p.id_produk, 
        k.id_kategori,
        sk.id_subkategori,
        k.nama_kategori,
        sk.nama_subkategori,
        p.nama_produk, 
        p.sku_produk, 
        p.barcode_produk, 
        p.deskripsi_produk, 
        p.harga_produk,
        p.modal_produk,
        p.diskon_produk,
        p.stok_produk,
        p.stok_minimum_produk,
        p.status_produk,
        p.gambar_produk,
        p.created_at,
        p.updated_at
      FROM tb_produk p
      JOIN tb_subkategori sk ON p.id_kategori = sk.id_subkategori
      JOIN tb_kategori k ON sk.id_kategori = k.id_kategori
      WHERE p.id_produk = ? LIMIT 1;
    `,[p_idProduk]);
  
    // Mapping agar kategori jadi array sesuai permintaan
    return rows.map(row => ({
      id_produk: row.id_produk,
      kategori: [{
        id_kategori: row.id_kategori,
        id_subkategori: row.id_subkategori,
        nama_kategori: row.nama_kategori,
        nama_subkategori: row.nama_subkategori,
      }],
      nama_produk: row.nama_produk,
      sku_produk: row.sku_produk,
      barcode_produk: row.barcode_produk,
      deskripsi_produk: row.deskripsi_produk,
      harga_produk: row.harga_produk,
      modal_produk: row.modal_produk,
      diskon_prpduk: row.diskon_produk,
      stok_produk: row.stok_produk,
      stok_minimum_produk: row.stok_minimum_produk,
      status_produk: row.status_produk,
      gambar_produk: row.gambar_produk,
      created_at: formatWIB(row.created_at),
      updated_at: formatWIB(row.updated_at),
    }));
  }

  static async createProduk(p_idKategori, p_namaProduk, p_skuProduk, p_barcodeProduk, p_deskripsiProduk, p_hargaProduk, p_modalProduk, p_diskonProduk, p_stokProduk, p_stokMinimumProduk, p_statusProduk, p_gambarProduk) {
    const [result] = await db.query(
      "INSERT INTO tb_produk (id_kategori, nama_produk, sku_produk, barcode_produk, deskripsi_produk, harga_produk, modal_produk, diskon_produk, stok_produk, stok_minimum_produk, status_produk, gambar_produk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [p_idKategori, p_namaProduk, p_skuProduk, p_barcodeProduk, p_deskripsiProduk, p_hargaProduk, p_modalProduk, p_diskonProduk, p_stokProduk, p_stokMinimumProduk, p_statusProduk, p_gambarProduk]
    );
    return result.insertId;
  }

  static async updateProduk(p_idProduk, p_namaProduk, p_skuProduk, p_barcodeProduk, p_deskripsiProduk, p_hargaProduk, p_modalProduk, p_stokProduk, p_stokMinimumProduk, p_gambarProduk) {
    await db.query(
      "UPDATE tb_produk SET nama_produk = ?, sku_produk = ?, barcode_produk = ?, deskripsi_produk = ?, harga_produk = ?, modal_produk = ?, stok_produk = ?, stok_minimum_produk = ?, gambar_produk = ? WHERE id_produk = ?",
      [p_namaProduk, p_skuProduk, p_barcodeProduk, p_deskripsiProduk, p_hargaProduk, p_modalProduk, p_stokProduk, p_stokMinimumProduk, p_gambarProduk, p_idProduk]
    );
  }

  static async deleteProduk(p_idProduk) {
    await db.query("DELETE FROM tb_produk WHERE id_produk = ?", [p_idProduk]);
  }
}

module.exports = Produk;
