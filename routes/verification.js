var express = require('express');
var ROUTER = express.Router();
const {logout,signup,signIn} = require('../controller/auth/verification.controller')
const { permissionHandler } = require('../middleware/token-validation')

//Authentication
ROUTER.post('/sign-up', signup);
ROUTER.post('/sign-in', signIn);
ROUTER.post('/logout', logout);
ROUTER.get('/permission-handler', permissionHandler);//token check in background progress
module.exports = ROUTER;
