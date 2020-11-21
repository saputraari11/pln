const [express, models, a, c, multer, path, fs] = [require("express"), require("../models/index"), require("../auth/admin").admin, require("../auth/pelanggan").pelanggan, require("multer"), require("path"), require("fs")]
const [pelanggan, pembayaran, tagihan, app, upload] = [models.pelanggan, models.pembayaran, models.tagihan, express(), multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./bukti")
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
        }
    })
})]


module.exports = {
        pembayaran: () => {
            return app.post("/", c, upload.single("bukti"), async(req, res) => {
                let [result, date] = [null, new Date()]
                result = await pelanggan.findOne({ where: { id_pelanggan: req.id_pelanggan }, include: ["tarif", { association: "penggunaan", include: ["tagihan"] }] })
                result = JSON.stringify(result)
                result = JSON.parse(result)
                let data = { id_tagihan: result.penggunaan[0].tagihan.id_tagihan, tanggal_pembayaran: date, bulan_bayar: result.penggunaan[0].tagihan.bulan, biaya_admin: 2000, total_bayar: 2000 + (result.tarif.tarifperkwh * result.penggunaan[0].tagihan.jumlah_meter), status: 0, bukti: req.file.filename, id_admin: null }
                pembayaran.create(data).then(r => {
                    res.json({ message: "Berhasil membayar" })
                }).catch(e => { res.json({ message: e.message }) })
            })
        },
        verifikasi: () => {
            return app.put("/", a, upload.single("bukti"), async(req, res) => {
                let data = {
                    id_admin: req.id_admin,
                    status: 1
                }
                let d = await pembayaran.findOne({ where: { id_pembayaran: req.body.id_pembayaran } })

                if (req.file) {
                    let foto = d.bukti
                    let tempat = path.join(__dirname, "..", "bukti", foto)
                    fs.unlink(tempat, e => { console.log(e.message); })
                    data["bukti"] = req.file.filename
                }
                pembayaran.update(data, { where: { id_pembayaran: req.body.id_pembayaran } }).then(r => {
                    let params = null
                    tagihan.update({ status: 1 }, { where: { id_tagihan: d.id_tagihan } }).then(r => {
                        res.json({ message: "Verifikasi sukses" })
                    }).catch(e => { res.json({ message: e.message }) })
                }).catch(e => { res.json({ message: e.message }) })
            })
        }
    }
    //  let d = await pelanggan.findOne({
    //     where: {
    //         id_pelanggan: data.id_pelanggan
    //     },
    //     include: ["tarif"]
    // })
    // let total_tagihan = d.tarif.tarifperkwh