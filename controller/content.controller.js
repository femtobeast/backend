const ContentModel = require('../models/content')
const hideData = 'fullname userImage -_id';
exports.getAllContent = async (req, res, next) => {
    try {
        ContentModel.find({}, function (err, result) {
            if (err) throw err;
            if (result) {
                res.json({
                    success: true,
                    data: result
                })
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        }).sort({
            createdAt: -1,
        }).populate({ path: "uploader", select: hideData })

    } catch (err) {
        return next({ "status": 401, message: "Data not available." });
    }
}
exports.addContent = async (req, res, next) => {
    try {
        let contentModel;
        contentModel = new ContentModel({
            uploader: req.session._id,
            title: req.body.title,
            subTitle: req.body.subTitle,
            desc: req.body.desc,
            owner: req.body.owner,
            reference: req.body.reference,
        });
        contentModel.save((err, success) => {
            if (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: false,
                    err: err.message,
                    message: 'Bad Request',
                })
            } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    message: 'Content posted.',
                })
            }
        });
    } catch (error) {
        return next({ status: 500, message: "Something went wrong.", error: error.message });
    }
}

exports.updateContent = async (req, res, next) => {
    try {
        ContentModel.findOneAndUpdate({ _id: req.body._id, },
            { $set: req.body },
            { new: true, useFindAndModify: false, }
        ).then(user => {
            if (user) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    message: `Content updated successfully`
                })
            } else {
                res.json({
                    success: false,
                    message: "Failed to update content"
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

exports.deleteContent = async (req, res, next) => {
    ContentModel.findOneAndDelete({ _id: req.params.id })
        .then(user => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                message: `Deleted successfully`,
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
        const user = await ContentModel.findOne({ _id: req.session._id })
        //check for password
        const checkCurrentPassword = await bcrypt.compareSync(req.body.currentpassword, user.password);
        if (!checkCurrentPassword) {
            return next({ status: 200, message: 'The current password is incorrect' });
        } else {
            const uid = user._id
            await ContentModel.findOneAndUpdate({ _id: uid },
                { password: hashedPassword, },
                { new: true, useFindAndModify: false, }
            ).then((result) => {
                res.json({
                    status: 200,
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
