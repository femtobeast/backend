const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let fileDestination = 'public/uploads/'
    if (req.body.event === 'package') {
      // it will upload inside users directory
      fileDestination += 'package'
    } else if (req.body.event ==='itinerary'){
      fileDestination += '/package/itinerary'
    } else if (req.body.event ==='hotel'){
      fileDestination += '/hotel'
    } else if (req.body.event ==='room'){
      fileDestination += '/hotel/room'
    } else if (req.body.event ==='restaurant'){
      fileDestination += '/restaurant'
    } else if (req.body.event ==='food'){
      fileDestination += '/restaurant/food'
    } else if (req.body.event ==='club'){
      fileDestination += '/club'
    } else if (req.body.event ==='story'){
      fileDestination += '/story'
    }
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

var imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg|JPG|JPEG|PNG|SVG)$/)) {
    return callback(new Error('You can upload an image file only'), false)
  }
  callback(null, true)
}

var upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  // limits: {
  //   fileSize: 2000000, // 2MB
  // },
}).array('picture',20)

module.exports = upload
