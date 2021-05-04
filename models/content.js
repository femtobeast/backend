const mongoose = require('mongoose')
const Schema = mongoose.Schema
let Content = new Schema(
    {
        uploader: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        title: {
            type: String,
            required:false,
        },
        subTitle : {
            type: String,
            required:false,
        },
        desc : {
            type: String,
            required:false,
        },
        owner: {
            type: String,
            required:false,
        },
        reference: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)
// hide some attributes of Post model while sending json response
Content.methods.toJSON = function () {
    let content = this.toObject()
    delete content.updatedAt
    delete content.__v
    return content
}

module.exports = mongoose.model('Content', Content)
