const [express, models] = [require("express"), require("../models/index")]
const [app, jwt, SECRET_KEY, level] = [express.Router(), require("jsonwebtoken"), "PLN11", models.level]

app.use(express.urlencoded({ extended: true }))
app.post("/", async(req, res) => {
    let data = { nama_level: req.body.nama_level }
    level.create(data).then(result => {
        res.json({ massage: "Data has been inserted" })
    }).catch(e => {
        res.json({ massage: e.massage })
    })
}).put("/", async(req, res) => {
    level.update({ nama_level: req.body.nama_level }, { where: { id_level: req.body.id_level } }).then(result => {
        res.json({ massage: "Data has been updated" })
    }).catch(e => {
        res.json({ massage: e.massage })
    })
}).delete("/:id_level", async(req, res) => {
    level.destroy({
        where: { id_level: req.params.id_level }
    }).then(result => {
        res.json({ massage: "Data has been deleted" })
    }).catch(e => {
        res.json({ massage: e.massage })
    })
}).get(/^(\/\d+|\/)$/, async(req, res) => {
    if (req.params[0].split("/")[1] != '') {
        level.findOne({ where: { id_level: req.params[0].split("/")[1] } }).then(result => {
            res.json({ data: result })
        }).catch(e => {
            res.json({ massage: e.massage })
        })
    } else {
        level.findAll(["level"]).then(result => {
            res.json({ data: result })
        }).catch(e => {
            res.json({ massage: e.massage })
        })
    }
})
module.exports = app