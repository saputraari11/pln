const [jwt, SECRET_KEY] = [require("jsonwebtoken"), "pln"]
module.exports = {
    pelanggan: (req, res, next) => {
        let [header] = [req.headers.authorization]
        let token = header && header.split(" ")[1]
        if ([token, header]) {
            jwt.verify(token, SECRET_KEY, { algorithms: "HS256" }, (e, r) => {

                if (e) {
                    res.json({ massage: e.message })
                } else if (r) {
                    req.id_pelanggan = r.id_pelanggan
                    next()
                }
            })

        } else {
            res.json({ massage: "Unauthorization Pelanggan" })

        }
    }
}