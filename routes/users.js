var express = require('express');
var ROUTER = express.Router();
const { getUser,
    deleteUser,
        updateUser,
    updatePassword,
    addUserForAdmin,
    getProfileDetail
} = require('../controller/user.controller')
const { verifyToken, multipleAuthVerify } = require('../middleware/token-validation')

ROUTER.get('/',multipleAuthVerify, getUser); 
ROUTER.post('/user-add',multipleAuthVerify, addUserForAdmin); 
ROUTER.put('/update',verifyToken, updateUser); 
ROUTER.delete('/delete/:id',multipleAuthVerify, deleteUser);
ROUTER.post('/user-profile',multipleAuthVerify, getProfileDetail);
ROUTER.post('/update-password',verifyToken, updatePassword);

module.exports = ROUTER;
