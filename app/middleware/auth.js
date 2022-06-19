const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.TOKEN_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403).send(err);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401).send('Unauthorized');
    }
};

module.exports = verifyToken;