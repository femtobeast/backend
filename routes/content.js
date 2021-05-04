var express = require('express');
var ROUTER = express.Router();
const { addContent, updateContent, getAllContent } = require('../controller/content.controller')
const {multipleAuthVerify,verifyToken } = require('../middleware/token-validation')

//SEARCH ROUTE
ROUTER.post('/add',multipleAuthVerify,addContent); // /api/content/dopost
ROUTER.get('/list',verifyToken,getAllContent); // /api/content/dolike
ROUTER.put('/update',updateContent); // /api/content/dolike

module.exports = ROUTER;