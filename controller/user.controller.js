const UserModel = require('../models/users')
const bcrypt = require('bcryptjs')
exports.getUser = async (req, res, next) => {
    try {
        UserModel.find({}, function (err, result) {
            if (err) throw err;
            if (result) {
                res.json({
                    success: true,
                    users: result
                })
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        }).sort({
            createdAt: -1,
          })

    } catch (err) {
        return next({ "status": 401, message: "Data not available." });
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        UserModel.findOneAndUpdate({ _id: req.body._id, },
            { $set: req.body },
            { new: true, useFindAndModify: false, }
        ).then(user => {
            if (user) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    message: `${user.fullname} updated successfully`
                })
            } else {
                res.json({
                    success: false,
                    message: "Failed to update user profile"
                })
            }
        }).catch(err => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Something wrong with database',
                    error: err.message,
                })
            }
        })
    } catch (error) {
        return next({ "status": 401, message: "Something went wrong." });
    }
}

exports.deleteUser = async (req, res, next) => {
    UserModel.findOneAndDelete({ _id: req.params.id })
        .then(user => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: `${user.fullname} deleted successfully`,
            })
        })
        .catch(err =>
            res.json({
                success: false,
                message: 'Failed to delete',
                error: err.message,
            })
        )
}

exports.updatePassword = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await UserModel.findOne({ _id: req.session._id })
        //check for password
        const checkCurrentPassword = await bcrypt.compareSync(req.body.currentpassword, user.password);
        if (!checkCurrentPassword) {
            return next({ status: 200, message: 'The current password is incorrect' });
        } else {
            const uid = user._id
            await UserModel.findOneAndUpdate({ _id: uid },
                { password: hashedPassword, },
                { new: true, useFindAndModify: false, }
            ).then((result) => {
                res.json({
                    status:200,
                    success: true,
                    message: "Password Updated"
                })
            }).catch(err => {
                return next({ message: "Password update failed", success: false });
            });
        }
    } catch (err) {
        next({ status: 500, message: "User not available", success: false, error: err });
    }
}

exports.addUserForAdmin = async (req,res,next)=>{
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash("femtobeast@", salt);
     UserModel.findOne({ email: req.body.email,contact: req.body.contact })
         .then(user => {
             if (user) {
                 res.json({
                     success: false,
                     message: 'A user with the given e-mail address already exists',
                 })
             } else {
                 UserModel.create(new UserModel({
                     email: req.body.email,
                     password: hashedPassword,
                     contact: req.body.contact,
                     gender: req.body.gender,
                     country: req.body.country,
                     address: req.body.address,
                     companyName: req.body.companyName,
                     fullname: req.body.fullname
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
                             message: 'User Added!',
                         })
                     }
                 })
             }
         })
         .catch(err => next(err))
}

exports.getProfileDetail = async (req,res,next)=>{
    try {
            // const token = req.header('Authorization').replace('Bearer ', '')
            const token = req.body.token;
            // const email = req.body.email;
            const decodedAdminId = jwt.verify(token, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N')
            const admin = await User.findOne({
                _id: decodedAdminId._id, 'tokens.token': token
            })
            if (!admin) {
                throw new Error()
            }        
            res.json({
                status: 200,
                success: true,
                data: admin
            })
    } catch (e) {
        res.status(401).send({ success: false, error: `User data is not inserted` })
    }
}
