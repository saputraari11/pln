const [express, models] = [require("express"), require("../models/index")]
const [penggunaan, tagihan, tarif, pelanggan] = [models.penggunaan, models.tagihan, models.tarif, models.pelanggan]
const bulan = { 1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni", 7: "July", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember" }
const [at, apt] = [express.Router(), express.Router()]

module.exports = {
    t: () => {

        return at.post("/input_tarif", async(req, res) => {

            tarif.create({
                daya: req.body.daya,
                tarifperkwh: req.body.tarif
            }).then(r => {
                res.json({ massage: "Data has been inserted" })
            }).catch(e => {
                res.json({ massage: e.massage })
            })

        }).put("/edit_tarif", async(req, res) => {

            let data = {
                    daya: req.body.daya,
                    tarifperkwh: req.body.tarif
                },
                params = {
                    id_tarif: req.body.id_tarif
                }
            for (x in data) {
                if (x !== undefined) {
                    delete x
                }
            }
            tarif.update(data, { where: params }).then(r => {
                res.json({ massage: "Data has been updated" })
            }).catch(e => {
                res.json({ massage: e.massage })
            })

        }).get(["/", "/:id_tarif"], async(req, res) => {
            if (req.baseUrl === "/tarif") {
                if (req.params.id_tarif) {
                    tarif.findOne({ where: { id_tarif: req.params.id_tarif } }).then(result => {

                        res.json({ data: result })
                    }).catch(e => {
                        res.json({ massage: e.massage })
                    })
                } else {
                    tarif.findAll().then(r => {
                        res.json({ data: r })
                    }).catch(e => {
                        res.json({ massage: e.massage })
                    })
                }
            }

        }).delete("/:id_tarif", async(req, res) => {

            tarif.destroy({
                where: { id_tarif: req.body.id_tarif }
            }).then(r => {
                res.json({ massage: "Data has been deleted" })
            }).catch(e => {
                res.json({ massage: e.massage })
            })

        })

    },
    p: () => {

        return apt.post("/", async(req, res) => {
            let data = { bulan: bulan[req.body.bulan], tahun: req.body.tahun }
            Object.assign(data, { id_pelanggan: req.body.id_pelanggan, meter_awal: req.body.meter_awal, meter_akhir: req.body.meter_akhir })
            let d = await pelanggan.findOne({
                where: {
                    id_pelanggan: data.id_pelanggan
                },
                include: ["tarif"]
            })
            let total_tagihan = d.tarif.tarifperkwh

            penggunaan.create(data).then(r => {
                let jumlah = (data.meter_akhir - data.meter_awal) * total_tagihan
                for (y of["meter_awal", "meter_akhir", "id_pelanggan"]) {
                    delete data[y]
                }
                Object.assign(data, { id_penggunaan: r.id_penggunaan, jumlah_meter: jumlah, status: 0 })
                tagihan.create(data).then(r => {
                    res.json({ massage: "Data has been inserted" })
                }).catch(e => {
                    res.json({ massage: e.massage })
                })
            }).catch(e => {
                res.json({ massage: e.massage })
            })
        }).put("/", async(req, res) => {

            let [data, params] = [{ bulan: bulan[req.body.bulan], tahun: req.body.tahun }, { id_penggunaan: req.body.id_penggunaan }]
            Object.assign(data, { id_pelanggan: req.body.id_pelanggan, meter_awal: req.body.meter_awal, meter_akhir: req.body.meter_akhir })

            for (x in data) {
                if (x !== undefined) { delete x }
            }
            penggunaan.update(data, { where: params }).then(r => {
                if (req.body.meter_akhir && req.body.meter_awal) {
                    let jumlah = data.meter_akhir - data.meter_awal
                    Object.assign(data, { jumlah_meter: jumlah })
                }
                for (y of["meter_awal", "meter_akhir", "id_pelanggan"]) {
                    delete data[y]
                }
                tagihan.update(data, { where: params }).then(r => {
                    res.json({ massage: "Data has been updated" })
                }).catch(e => {
                    res.json({ massage: e.massage })
                })
            }).catch(e => {
                res.json({ massage: e.massage })
            })
        }).delete("/:id_penggunaan", async(req, res) => {
            try {
                penggunaan.destroy({
                    where: { id_penggunaan: req.body.id_penggunaan }
                })
                tagihan.destroy({
                    where: { id_penggunaan: req.body.id_penggunaan }
                })
            } catch (e) {
                res.json({ message: e.message })
            }
        }).get(["/", "/:id_penggunaan"], async(req, res) => {
            if (req.baseUrl === "/tagihan") {
                try {
                    let result = await penggunaan.findAll({
                        include: { association: "tagihan", include: ["pembayaran"] }
                    })
                    let data = null
                    data = JSON.stringify(result)
                    data = JSON.parse(data)
                    for (i in data) {
                        if (data[i].tagihan.status == 0) {
                            data[i].tagihan.status = "Verifikasi tidak valid"
                        } else if (data[i].tagihan.status == 1) {
                            data[i].tagihan.status = "Verifikasi valid"
                        }
                        if (data[i].tagihan.pembayaran === null) {
                            data[i].tagihan.pembayaran = "Tidak Tersedia"
                        }
                    }
                    res.json(data)
                } catch (e) {
                    console.log(e);
                    res.json({ message: e.message })

                }
            }

        })
    }
}