const db = require("../config/db");
const formatWIB = require("../utils/time");

class Penjualan {
  static async getAllPenjualan(idpetugas = null, tanggal = null) {
    const whereClauses = [];
    const values = [];
  
    // Filter berdasarkan id petugas (jika ada)
    if (idpetugas) {
      whereClauses.push("p.id_karyawan = ?");
      values.push(idpetugas);
    }
  
    // Filter berdasarkan tanggal (jika ada)
    if (tanggal) {
      if (tanggal.includes("_")) {
        // Format rentang tanggal: YYYY-MM-DD_YYYY-MM-DD
        const [start, end] = tanggal.split("_");
        whereClauses.push("DATE(p.tanggal_penjualan) BETWEEN ? AND ?");
        values.push(start, end);
      } else {
        // Format tanggal tunggal: YYYY-MM-DD
        whereClauses.push("DATE(p.tanggal_penjualan) = ?");
        values.push(tanggal);
      }
    }
  
    // Susun query akhir
    const query = `
      SELECT 
          p.id_penjualan, p.total_harga, p.status_pembayaran, p.tanggal_penjualan,
          p.created_at AS penjualan_created_at, p.updated_at AS penjualan_updated_at,
          s.id_customers, s.nama_customers, s.telp_customers, s.email_customers,
          kar.id_karyawan, u.nama_user, u.contact_user, kar.posisi_karyawan,
          dp.id_detail_penjualan, dp.kuantitas, dp.harga, dp.subtotal,
          pr.id_produk, pr.nama_produk, pr.sku_produk, pr.barcode_produk, pr.deskripsi_produk,
          pr.harga_produk, pr.modal_produk, pr.stok_produk, pr.stok_minimum_produk,
          sk.id_subkategori, sk.nama_subkategori, k.id_kategori, k.nama_kategori
      FROM tb_penjualan p
      LEFT JOIN tb_customers s ON p.id_customers = s.id_customers
      LEFT JOIN tb_karyawan kar ON p.id_karyawan = kar.id_karyawan
      LEFT JOIN tb_users u ON kar.id_user = u.id_user
      LEFT JOIN tb_detail_penjualan dp ON p.id_penjualan = dp.id_penjualan
      LEFT JOIN tb_produk pr ON dp.id_produk = pr.id_produk
      LEFT JOIN tb_subkategori sk ON pr.id_kategori = sk.id_subkategori
      LEFT JOIN tb_kategori k ON sk.id_kategori = k.id_kategori
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
    `;
  
    const [rows] = await db.query(query, values);
  
    // Format ulang hasil penjualan
    const penjualan = {};
  
    rows.forEach(row => {
      if (!penjualan[row.id_penjualan]) {
        penjualan[row.id_penjualan] = {
          id_penjualan: row.id_penjualan,
          total_harga: row.total_harga,
          status_pembayaran: row.status_pembayaran,
          tanggal_penjualan: formatWIB(row.tanggal_penjualan),
          created_at: formatWIB(row.penjualan_created_at),
          updated_at: formatWIB(row.penjualan_updated_at),
          customers: {
            id_customers: row.id_customers,
            nama_customers: row.nama_customers,
            telp_customers: row.telp_customers,
            email_customers: row.email_customers,
          },
          karyawan: {
            id_karyawan: row.id_karyawan,
            nama_user: row.nama_user,
            posisi_karyawan: row.posisi_karyawan,
            contact_user: row.contact_user,
          },
          detail_penjualan: [],
        };
      }
  
      // Isi detail penjualan jika ada
      if (row.id_detail_penjualan) {
        penjualan[row.id_penjualan].detail_penjualan.push({
          id_detail_penjualan: row.id_detail_penjualan,
          kuantitas: row.kuantitas,
          harga: row.harga,
          subtotal: row.subtotal,
          produk: {
            id_produk: row.id_produk,
            nama_produk: row.nama_produk,
            sku_produk: row.sku_produk,
            barcode_produk: row.barcode_produk,
            deskripsi_produk: row.deskripsi_produk,
            harga_produk: row.harga_produk,
            modal_produk: row.modal_produk,
            stok_produk: row.stok_produk,
            stok_minimum_produk: row.stok_minimum_produk,
            subkategori: {
              id_subkategori: row.id_subkategori,
              nama_subkategori: row.nama_subkategori,
              kategori: {
                id_kategori: row.id_kategori,
                nama_kategori: row.nama_kategori,
              },
            },
          },
        });
      }
    });
  
    return Object.values(penjualan);
  }

  static async createPenjualan(p_idCustomers, p_idKaryawan, p_totalHarga, p_details, p_tanggal) {
        const connection = await db.getConnection();
        try {
          await connection.beginTransaction();

          // Insert into tb_penjualan
          const [penjualanResult] = await connection.query(
            "INSERT INTO tb_penjualan (id_customers, id_karyawan, total_harga, status_pembayaran, tanggal_penjualan) VALUES (?, ?, ?, 'Success', ?)",
            [p_idCustomers, p_idKaryawan, p_totalHarga, p_tanggal]
          );
          const penjualanId = penjualanResult.insertId;
        
          // Insert into tb_detail_pembelian
          for (const detail of p_details) {
            const { p_idProduk, p_kuantitas, p_harga, p_subTotal } = detail;
            await connection.query(
              "INSERT INTO tb_detail_penjualan (id_penjualan, id_produk, kuantitas, harga, subtotal) VALUES (?, ?, ?, ?, ?)",
              [penjualanId, p_idProduk, p_kuantitas, p_harga, p_subTotal]
            );
          }

          await connection.commit();
          return penjualanId;
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
    }
    
    static async updatePenjualan(p_idPenjualan, p_idCustomers, p_idKaryawan, p_totalHarga, p_statusPenjualan) {
      await db.query(
        "UPDATE tb_penjualan SET id_customers = ?, id_karyawan = ?, total_harga = ?, status_pembayaran = ? WHERE id_penjualan = ?",
        [p_idCustomers, p_idKaryawan, p_totalHarga, p_statusPenjualan, p_idPenjualan]
      );
    }

    static async deletePenjualan(p_idPenjualan) {
      await db.query("DELETE FROM tb_penjualan WHERE id_penjualan = ?", [p_idPenjualan]);
    }
}

module.exports = Penjualan;
