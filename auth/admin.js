const [jwt, SECRET_KEY] = [require("jsonwebtoken"), "PLN11"]
module.exports = {
    admin: (req, res, next) => {
        let [header, j] = [req.headers.authorization, { algorithm: "HS256", maxAge: "5m" }]
        let token = header && header.split(" ")[1]
        if ([token, header]) {
            jwt.verify(token, SECRET_KEY, j, (e, r) => {
                if (e) {
                    console.error(e)
                    res.json({ massage: e.name })
                } else {
                    req.id_admin = r.id_admin
                    next()
                }
            })

        } else {
            res.json({ massage: "Unauthorization Admin" })
        }

    }
}