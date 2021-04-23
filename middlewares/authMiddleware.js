const {verify} = require("../helpers/auth");

module.exports.ensureAuth = (req, res, next) => {
    const header = req.header('Authorization')

    if(header && header.split(' ').length === 2)
        try {
            const user = verify(header.split(' ')[1])

            if(user) {
                req.user = user
                return next()
            }
        } catch(err) {
            return res.send({
                status: false,
                message: 'UNAUTHORIZED'
            })
        }

    return res.send({
        status: false,
        message: 'UNAUTHORIZED'
    })
}