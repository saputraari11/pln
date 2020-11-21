const [express, models, c, a, cors] = [require("express"), require("../models/index"), require("../auth/pelanggan").pelanggan, require("../auth/admin").admin, require("cors")]
const [app, jwt, SECRET_KEY, pelanggan, s] = [express.Router(), require("jsonwebtoken"), "pln", models.pelanggan, require("sha256")]


app.use(express.urlencoded({ extended: true }))
app.use(cors())


module.exports = {
    p: () => {
        return app.post("/", async(req, res) => {
            let data = { username: req.body.username, password: s(req.body.password), nomor_kwh: req.body.nomor_kwh, nama_pelanggan: req.body.nama, alamat: req.body.alamat, id_tarif: req.body.id_tarif }
            pelanggan.create(data).then(r => {
                res.json({ massage: "Data has been inserted" })
            }).catch(e => {
                res.json({ massage: e.massage })
            })
        }).post("/login", async(req, res) => {
            try {
                let params = { username: req.body.username, password: s(req.body.password) }
                let result = await pelanggan.findOne({ where: params })
                let rr = JSON.stringify(result)

                let sign = jwt.sign(JSON.parse(rr), SECRET_KEY, {
                    algorithm: "HS256",
                    expiresIn: "5m"
                }, (e, r) => {
                    if (e) { res.json({ message: e.message }) } else { res.json({ data: result, token: r }) }
                })

            } catch (e) {
                res.json({ message: e })
            }
        }).get("/info", c, async(req, res) => {
            try {
                let d = null
                d = await pelanggan.findOne({ include: ["tarif", { association: "penggunaan", include: { association: "tagihan", include: ["pembayaran"] } }], where: req.id_pelanggan })
                d = JSON.stringify(d)
                d = JSON.parse(d)

                if (d.penggunaan[0] !== undefined) {
                    if (d.penggunaan[0].tagihan.pembayaran == null) {
                        d.penggunaan[0].tagihan.pembayaran = "Belum Terbayar"
                        let s = {
                            data: { nomor_kwh: d.nomor_kwh, daya: d.tarif.daya, nama_pelanggan: d.nama_pelanggan, bulan: d.penggunaan[0].tagihan.bulan, tarif: "Rp." + d.tarif.tarifperkwh, total_meteran: d.penggunaan[0].tagihan.jumlah_meter, total_tagihan: "Rp." + (d.penggunaan[0].tagihan.jumlah_meter * d.tarif.tarifperkwh), pembayaran: d.penggunaan[0].tagihan.pembayaran }
                        }
                        res.json(s)
                    } else if (d.penggunaan[0].tagihan.pembayaran.status == false) {
                        d.penggunaan[0].tagihan.pembayaran.status = "belum Terkonfirmasi"
                        let s = {
                            data: {
                                nomor_kwh: d.nomor_kwh,
                                daya: d.tarif.daya,
                                nama_pelanggan: d.nama_pelanggan,
                                bulan: d.penggunaan[0].tagihan.bulan,
                                tarif: "Rp." + d.tarif.tarifperkwh,
                                total_meteran: d.penggunaan[0].tagihan.jumlah_meter,
                                biaya_admin: "Rp." +
                                    d.penggunaan[0].tagihan.pembayaran.biaya_admin,
                                total_tagihan: "Rp." + d.penggunaan[0].tagihan.pembayaran.total_bayar,
                                pembayaran: d.penggunaan[0].tagihan.pembayaran.status
                            }
                        }
                        res.json(s)
                    } else {
                        res.json({ message: "Tidak terdapat tagihan" })
                    }
                } else {
                    pelanggan.findOne({ where: { id_pelanggan: req.id_pelanggan } }).then(r => {
                        res.json({ data: r })
                    })
                }

            } catch (e) {
                res.json({ massage: e.message })
            }

        })
    },
    a: () => {
        return app.use(a).delete("/", async(req, res) => {
            data = { username: req.body.username, password: req.body.password, nama_pelanggan: req.body.nama, id_tarif: req.body.id_tarif }
            pelanggan.create(data).create(r => {
                res.json({ massage: "Data has been inserted" })
            }).catch(e => {
                res.json({ massage: e.massage })
            })
        }).put("/", async(req, res) => {
            let [data, params] = [{ username: req.body.username, nomor_kwh: req.body.nomor_kwh, nama_pelanggan: req.body.nama, id_tarif: req.body.id_tarif }, { id_pelanggan: req.body.id_pelanggan }]
            for (x in data) {
                if (x === undefined) {
                    delete x
                }
            }
            if (req.body.password) { data["password"] = s(req.body.password) }
            pelanggan.update(data, { where: params }).create(r => {
                res.json({ massage: "Data has been updated" })
            }).catch(e => {
                res.json({ massage: e.massage })
            })
        }).get("/infoAll", (req, res) => {
            pelanggan.findAll({ include: ["tarif", { association: "penggunaan", include: { association: "tagihan", include: ["pembayaran"] } }], where: req.id_pelanggan }).then(r => {
                let [d, s] = [null, null]
                d = JSON.stringify(r)
                d = JSON.parse(d)
                for (i in d) {
                    if (d[i].penggunaan[0].tagihan.pembayaran == null) {
                        s = {
                            data: { id_pelanggan: d[i].id_pelanggan, nomor_kwh: d[i].nomor_kwh, nama_pelanggan: d[i].nama_pelanggan, tarif: "Rp." + d[i].tarif.tarifperkwh, total_meteran: d[i].penggunaan[0].tagihan.jumlah_meter, total_tagihan: "Rp." + (d[i].penggunaan[0].tagihan.jumlah_meter * d[i].tarif.tarifperkwh) }
                        }
                    } else if (d[i].penggunaan[0].tagihan.status == 0) {
                        d[i].penggunaan[0].tagihan.pembayaran.status = "Belum Terkonfirmasi"
                        s = {
                            data: { id_pelanggan: d[i].id_pelanggan, nomor_kwh: d[i].nomor_kwh, nama_pelanggan: d[i].nama_pelanggan, tarif: "Rp." + d[i].tarif.tarifperkwh, total_meteran: d[i].penggunaan[0].tagihan.jumlah_meter, total_tagihan: "Rp." + (d[i].penggunaan[0].tagihan.jumlah_meter * d[i].tarif.tarifperkwh), status: d[i].penggunaan[0].tagihan.pembayaran.status }
                        }

                    } else { s = { message: "Tidak Terdapat beberapa tagihan" } }
                }
                res.json(s)

            }).catch(e => {
                console.log(e);
                res.json({ massage: e.message })
            })
        })
    }
}