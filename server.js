const { urlencoded } = require("express")

const express = require("express"),
    app = express(),
    status = require("./router/status.js"),
    admin = require("./router/admin.js"),
    pelanggan = require("./router/customer"),
    stored = require("./router/stored"),
    pembayaran = require("./router/pembayaran"),
    a = require("./auth/admin").admin

app.use("/status", status)
app.use("/tarif", stored.t())
app.use("/pelanggan", [pelanggan.p(), pelanggan.a()])
app.use("/tagihan", [urlencoded({ extended: true }), a], stored.p())
app.use("/admin", admin)
app.use("/pembayaran", [pembayaran.pembayaran(), pembayaran.verifikasi()])

app.listen(8080, () => {
    console.log("Server run on port 8080")
})