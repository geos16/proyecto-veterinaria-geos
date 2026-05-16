const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { protegerRuta, esAdmin } = require('../middlewares/auth');

router.use(protegerRuta, esAdmin);

router.get('/', usuarioController.listarUsuarios);
router.post('/borrar/:id', usuarioController.eliminarUsuario);

module.exports = router;