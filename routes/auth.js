const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protegerRuta, esAdmin } = require('../middlewares/auth');

router.get('/login', authController.formularioLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/registro', protegerRuta, esAdmin, authController.formularioRegistro);

router.post('/registro', protegerRuta, esAdmin, async (req, res) => {
    const Usuario = require('../models/Usuario');
    try {
        await Usuario.create(req.body);
        res.redirect('/login'); 
    } catch (error) {
        res.send("Error al registrar: " + error.message);
    }
});

module.exports = router;