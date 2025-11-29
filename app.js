const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

function validateBook(data) {
    if (!data.judul || !data.penulis || !data.tahun) {
        return "Semua field (judul, penulis, tahun) wajib diisi";
    }
    if (isNaN(data.tahun)) {
        return "Tahun harus berupa angka";
    }
    return null;
}


app.get('/buku', (req, res) => {
    db.query("SELECT * FROM buku", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get('/buku/:id', (req, res) => {
    db.query("SELECT * FROM buku WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json(result[0]);
    });
});

app.post('/buku', (req, res) => {
    const error = validateBook(req.body);
    if (error) return res.status(400).json({ error });

    const { judul, penulis, tahun } = req.body;

    db.query(
        "INSERT INTO buku (judul, penulis, tahun) VALUES (?, ?, ?)",
        [judul, penulis, tahun],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Buku berhasil ditambahkan", id: result.insertId });
        }
    );
});

app.put('/buku/:id', (req, res) => {
    const error = validateBook(req.body);
    if (error) return res.status(400).json({ error });

    const { judul, penulis, tahun } = req.body;

    db.query(
        "UPDATE buku SET judul = ?, penulis = ?, tahun = ? WHERE id = ?",
        [judul, penulis, tahun, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });
            res.json({ message: "Buku berhasil diperbarui" });
        }
    );
});

app.delete('/buku/:id', (req, res) => {
    db.query("DELETE FROM buku WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json({ message: "Buku berhasil dihapus" });
    });
});


app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});
