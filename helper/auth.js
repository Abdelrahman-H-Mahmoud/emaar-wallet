const jwt = require('jsonwebtoken');
const config = require('../config/env-config');

module.exports = {
    checkAuthentication: function (req, res, next) {
        let token = req.headers['access-token'];
       /*
        if(!req.isAuthenticated()){
            res.status(401);
            return res.json({msg:'Invalid User',code:401});
        }
        */
        if (!token) {
            res.status(401);
            return res.json({msg:'Token Is Required',code:401});
        }

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.status(401);
                return res.json({msg:'Invalid Token',code:401});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
}