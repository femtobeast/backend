// const mongoose = require("mongoose")
// const jwt = require("jsonwebtoken")
// const bcrypt =require('bcryptjs')
// const AdminSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required:true,
//         trim: true,
//     },
//     email: {
//         type: String,
//         required:true,
//         trim: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required:true,
//         trim: true,
//     },
//     contact: {
//         type: String,
//         trim: true,
//         required:false,
//         unique: true,
//     },
//     tokens: [{
//         token: {
//             type: String
//         }
//     }]
// })

// // login credentials checker function
// AdminSchema.statics.checkCrediantialsDb = async (email, password) => {
//     const adminCheck = await admins.findOne({ email })
//     const match = await bcrypt.compare(password, adminCheck.password)
//     if (!adminCheck) {
//         return next({ "status": 401, message: `Admin with this email: ${adminCheck.email} not found` });
//     }
//     if (match) {
//         return adminCheck;
//     } 
// }

// // login token generator function
// AdminSchema.methods.generateAuthToken = async function () {
//     const adminAuth = this
//     const token = jwt.sign({
//         _id: adminAuth._id.toString(),
//         accessLevel: 'super-admin-scout'
//     }, '7pY5CRSqIOB9NooY225lPKQ0KuAFvnkFX6cU9Eph1N',{
//         expiresIn:"24hr"
//     })
//     adminAuth.tokens = adminAuth.tokens.concat({ token: token })
//     await adminAuth.save()
//     return token
// }

// // database model 
// const admins = mongoose.model('Admins', AdminSchema)
// module.exports = admins