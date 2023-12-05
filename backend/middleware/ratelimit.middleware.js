const { rateLimit } = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 10*10*60,
    limit:70,
})


module.exports = {
    limiter
}