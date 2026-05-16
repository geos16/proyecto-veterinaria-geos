const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const { esAdmin } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator'); // Importamos el validador

const validarMascota = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 2 }).withMessage('Mínimo 2 letras'),
    body('especie').isIn(['Perro', 'Gato', 'Otro']).withMessage('Especie no válida'),
    body('raza').trim().notEmpty().withMessage('La raza es obligatoria').isLength({ min: 3 }).withMessage('La raza debe tener al menos 3 letras'),
    body('fecha_nacimiento').optional({ checkFalsy: true }).isISO8601().withMessage('Fecha inválida')
];

router.get('/', mascotaController.listarMascotas);
router.get('/nuevo', mascotaController.formularioCrear);
router.get('/detalle/:id', mascotaController.verDetalle);

router.post('/crear', validarMascota, mascotaController.crearMascota);

router.get('/editar/:id', esAdmin, mascotaController.formularioEditar);
router.post('/actualizar/:id', esAdmin, validarMascota, mascotaController.actualizarMascota);
router.post('/borrar/:id', esAdmin, mascotaController.borrarMascota);

module.exports = router;