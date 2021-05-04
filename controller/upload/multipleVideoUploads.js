const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { max } = require('moment')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let fileDestination = 'public/uploads/video'
    // check if directory exists
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true }) // recursive:true creates parent folder as well as sub folders
      callback(null, fileDestination)
    } else {
      callback(null, fileDestination)
    }
  },
  filename: (req, file, callback) => {
    let filename = path.basename(file.originalname, path.extname(file.originalname))
    let ext = path.extname(file.originalname)
    callback(null, filename + '_' + Date.now() + ext)
  },
})

var fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp4|flv|3gp|mp3|mov|wmv|avi|mpeg|mkv)$/)) {
    return callback(new Error('Invalid file format'), false)
  }
  callback(null, true)
}

var fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('video')

module.exports = fileUpload
