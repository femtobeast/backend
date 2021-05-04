const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const {ADMINISTRATOR} = require('../role')
const Schema = mongoose.Schema

let UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        type: {
            type: String,
            default: 'User',
        },
        contact: {
            type: String,
            unique: true,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false
        },
        fullname: {
            type: String,
            required: true,
        },
        userImage: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            required: false,
        },
        verified: {
            type: Boolean,
            default:false
        },
        tokens: [{
            token: {
                type: String,
                required: false
            }
        }]
    },
    {
        timestamps: true,
    }
)
// hide some attributes of user model while sending json response
UserSchema.methods.toJSON = function () {
    let user = this.toObject()
    delete user.updatedAt
    delete user.__v
    return user
}


// login credentials checker function
UserSchema.statics.checkCrediantialsDb = async (email, password) => {
    const userExist = await user.findOne({ email })
    const match = await bcrypt.compare(password, userExist.password)
    if (!userExist) {
        return next({ "status": 401, message: `User with this email: ${userExist.email} not found` });
    }
    if (match) {
        return userExist;
    } 
}

// login token generator function
UserSchema.methods.generateAuthToken = async function () {
    const userAuth = this
    const token = jwt.sign({
        _id: userAuth._id.toString(),
        accessLevel: 'super-admin-scout'
    }, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N',{
        expiresIn:"24hr"
    })
        userAuth.tokens = userAuth.tokens.concat({ token: token })
        await userAuth.save()
        return token
   
}
const user = mongoose.model('Users', UserSchema)
module.exports = user;
