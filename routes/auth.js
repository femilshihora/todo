const express = require('express');
const { register, login, logout, updateuser, deleteUserById } = require('../api/controller/auth');
const router = express.Router();    

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.put('/updateuser/:id',updateuser);
router.delete('/deleteuser/:id',deleteUserById);

module.exports = router;