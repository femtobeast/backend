const jwt = require('jsonwebtoken')
const User = require("../models/users")
const Admin = require("../models/admin")
//--GENERATE TOKEN 
exports.generateJwtToken = (req, res, next) => {
    jwt.sign({
        username: req.body.email,
        accessLevel: 'super-admin-scout'
    }, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N', {
        expiresIn: "24hr"
    },
        function (err, token) {
            if (err != null || undefined) {
                next({ status: 401, message: "Unauthorized token" })
            } else {
                try {
                    req.session.token = token;
                    const { fullname, type, email, username } = req.user;
                    res.json({
                        success: true,
                        message: `Loged in: ${req.session.email}`,
                        token, username: req.session.username,
                        user: {
                            fullname,
                            type,
                            email,
                            username
                        }
                    })
                } catch (error) {
                    return next({ status: 401, message: "Login Failed | Something went wrong" })
                }
            }
        }
    )

}
// --VERIFY TOKEN FOR AUTHENTICATION
exports.verifyToken = function (req, res, next) {
    if (req.headers.authorization == undefined) {
        return next({ status: 401, message: 'Access Denied' })
    } else {
        let token = req.headers.authorization.slice(7, req.headers.authorization.length)
        jwt.verify(token, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N', function (err, decoded) {
            if (err != null) {
                next({ status: 401, message: "Token not verified." })
            } else {
                next();
            }
        })

    }
}
//Access For Only User Authentication
// exports.userAuth = async (req, res, next) => {
//     try {
//         if (req.headers.authorization == undefined) {
//             return next({ status: 401, message: 'Authentication Failed !!!' })
//         } else {
//             const token = req.header('Authorization').replace('Bearer ', '')
//             const decodedUserId = jwt.verify(token, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N')
//             const user = await User.findOne({
//                 _id: decodedUserId._id, 'token': token
//             })
//             if (!user) {
//                 throw new Error()
//             }
//             req.token = token
//             req.user = user
//             next()
//         }
//     } catch (e) {
//         res.status(401).send({ error: 'Authentication Failed! | Token is expired' })
//     }
// }
//Access For Only Admin Authentication
exports.multipleAuthVerify = async (req, res, next) => {
    try {
        if (req.headers.authorization == undefined) {
            return next({ status: 401, message: 'Authentication Failed !!!' })
        } else {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decodedAdminId = jwt.verify(token, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N')
            const admin = await User.findOne({
                _id: decodedAdminId._id, 'tokens.token': token
            })
            if (!admin) {
                throw new Error()
            }
            req.token = token
            req.admin = admin
            next()
        }
    } catch (e) {
        res.status(401).send({ error: 'Authentication Failed! | Token invalid' })
    }
}
exports.permissionHandler = async (req, res, next) => {
    try {
        if (req.headers.authorization == undefined) {
            return next({ status: 401, success:false, message: 'Permission Denied!' })
        } else {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decodedAdminId = jwt.verify(token, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N')
            const admin = await User.findOne({
                _id: decodedAdminId._id, 'tokens.token': token
            })
            if (!admin) {
                throw new Error()
            }
            const { type, email } = admin;
            res.json({
                status: 200,
                success: true,
                data: { email: email, type: type }
            })
        }
    } catch (e) {
        res.status(401).send({ success: false, error: `You don't have access to the system` })
    }
}
exports.dataPermission = async (req, res, next) => {
    try {
        if (req.headers.permission == undefined ) {
            return next({ status: 401, success:false, message: 'Permission Denied!' })
        } else {
            const permission = req.header('Permission');
            if(permission === "21f@do8GP3RMISI0N-D@T@"){
                next();
            }else{
            return next({ status: 401, success:false, message: `You don't have access to the data` })
            }
        }
    } catch (e) {
        res.status(401).send({ success: false, error: `You don't have access to the data` })
    }
}
exports.checkLoginStatus = (req, res, next) => {
    if (!req.session) {
        return next({
            status: 403,
            success: false,
            message: 'Please login first!!!',
        })
    } else {
        next()
    }
}