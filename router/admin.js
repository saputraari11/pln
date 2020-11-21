const [express, models, d, a, cors] = [require("express"), require("../models/index"), require("express-dynamic-middleware"), require("../auth/admin"), require("cors")]
const [app, jwt, SECRET_KEY, admin, s, du] = [express.Router(), require("jsonwebtoken"), "PLN11", models.admin, require("sha256"), d.create(a.admin)]


app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.post("/", async(req, res) => {
    let data = { username: req.body.username, password: s(req.body.password), nama_admin: req.body.nama, id_level: req.body.id_level }
    admin.create(data).then(r => {
        res.json({ massage: "Data has been inserted" })
    }).catch(e => {
        res.json({ massage: e.massage })
    })
})
app.post("/auth", async(req, res) => {
    try {
        let [params, j] = [{ username: req.body.username, password: s(req.body.password) }, { algorithm: "HS256", expiresIn: "5m" }]
        let result = await admin.findOne({ where: params })
        let data = JSON.stringify(result)
        let sign = jwt.sign(JSON.parse(data), SECRET_KEY, j, (e, r) => {
            if (e) { res.json({ message: e.message }) } else { res.json({ data: result, token: r }) }
        })

    } catch (e) {
        res.json[{ massage: e.massage }]
    }
})
app.use(du.handle())
app.put("/", async(req, res) => {
    let [data, params] = [{ username: req.body.username, password: req.body.password, nama_admin: req.body.nama, id_level: req.body.id_level }, { id_admin: req.body.id_admin }]
    admin.update(data, { where: params }).create(r => {
        res.json({ massage: "Data has been updated" })
    }).catch(e => {
        res.json({ massage: e.massage })
    })
}).get(/^(\/\d+|\/)$/, async(req, res) => {
    let d = await admin.findOne({ include: ["level"], where: req.id_admin })
    let s = {
        username: d.username,
        nama_admin: d.nama_admin,
        jabatan: d.level.nama_level
    }
    if (req.params[0].split("/")[1] != '') {
        admin.findOne({ include: ["level"], where: { id_admin: req.params[0].split("/")[1] } }).then(result => {
            res.json({ data: result, yours: s })
        }).catch(e => {
            res.json({ massage: e.massage })
        })
    } else {
        admin.findAll().then(r => {
            res.json({ data: r, yours: s })
        }).catch(e => {
            res.json({ massage: e.massage })
        })
    }
}).delete("/", async(req, res) => {
    data = { username: req.body.username, password: req.body.password, nama_admin: req.body.nama, id_level: req.body.id_level }
    admin.create(data).create(r => {
        res.json({ massage: "Data has been inserted" })
    }).catch(e => {
        res.json({ massage: e.massage })
    })
})
module.exports = app