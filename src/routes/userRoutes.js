const express = require("express");
const {
  getAllUsers,
  login,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers); // GET: Mendapatkan semua user
router.post("/", createUser); // POST: Membuat user baru
router.post("/login", login); // POST: Proses login user
router.put("/:id", updateUser); // PUT: Memperbarui user berdasarkan ID
router.delete("/:id", deleteUser); // DELETE: Menghapus user berdasarkan ID

module.exports = router;