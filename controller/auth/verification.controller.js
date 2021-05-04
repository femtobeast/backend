const UserModel = require('../../models/users')
const AdminModel = require('../../models/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// For User Registration
exports.signup = async (req, res, next) => {
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    UserModel.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                res.json({
                    success: false,
                    message: 'A user with the given e-mail address already exists',
                })
            } else {
                UserModel.create(new UserModel({
                    fullname: req.body.fullname,
                    email: req.body.email,
                    password: hashedPassword,
                    contact: req.body.contact,
                    address: req.body.address
                }), (err, user) => {
                    if (err) {
                        res.statusCode = 500
                        res.setHeader('Content-Type', 'application/json')
                        res.json({
                            success: false,
                            err: err,
                            message: 'Bad Request',
                        })
                    } else {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json({
                            success: true,
                            message: 'Registration Successful!',
                        })
                    }
                })
            }
        })
        .catch(err => next(err))
}
//For User Sign in
exports.signIn = async (req, res, next) => {
    try {
        const currentUser = await UserModel.checkCrediantialsDb(req.body.email, req.body.password)
        const token = await currentUser.generateAuthToken()
        const userdetails =
        {
            token: token,
            name: currentUser.fullname,
            email: currentUser.email,
            type: currentUser.type,
            _id: currentUser._id
        }
        req.session.token = token;
        req.session.email = userdetails.email;
        req.session.username = userdetails.username;
        req.session.type=userdetails.type;
        req.session._id=userdetails._id;
        res.json({
            success: true,
            user: userdetails,
            message: `Loged in as: ${currentUser.email} `
        })
    }
    catch (err) {
        return next({ success: false, status: 401, message: "Invalid username and password", error: err.message });

    }
}

//For Admin Verification (not used)
exports.adminSignIn = async (req, res, next) => {
    try {
        const currentUser = await AdminModel.checkCrediantialsDb(
            req.body.email,
            req.body.password)
        const token = await currentUser.generateAuthToken()
        const userdetails = {
            token: token,
            _id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
        }
        req.session.email = userdetails.email;
        res.json({
            success: true,
            data: userdetails,
            error: {}
        })
    }
    catch (e) {
        return next({ success: false, status: 401, message: "Invalid username and password" });
    }
}

// For Logout
exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('not logged out');
        }
        res.clearCookie('fbid')
        res.statusCode = 200
        
        res.setHeader('Content-Type', 'application/json')
        res.json({
            success: true,
            message: 'Logged Out',
            status:200
        })
    })

}
