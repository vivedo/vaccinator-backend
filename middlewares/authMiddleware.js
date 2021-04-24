const {verify} = require("../helpers/auth");

/**
 * Validates Authorization HTTP header and injects user property into Express' Resource
 *
 * Authorization: Bearer <token>
 */
module.exports.ensureAuth = (req, res, next) => {
    const header = req.header('Authorization')

    if(header && header.split(' ').length === 2)
        try {
            const user = verify(header.split(' ')[1])

            if(user) {
                req.user = user
                return next()
            }
        } catch(err) { /* DO NOTHING AND CONTINUE SENDING UNAUTHORIZED RESPONSE*/ }

    res.send({
        status: false,
        message: 'UNAUTHORIZED'
    })
}