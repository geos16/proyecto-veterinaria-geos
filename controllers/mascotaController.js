const { validationResult } = require('express-validator');
const Mascota = require('../models/Mascota');

exports.listarMascotas = async (req, res) => {
    const mascotas = await Mascota.findAll();
    res.render('mascotas/index', { mascotas });
};

exports.formularioCrear = (req, res) => {
    res.render('mascotas/crear');
};

exports.crearMascota = async (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.render('mascotas/crear', { errores: errores.array(), datos: req.body });
    }
    try {
        await Mascota.create(req.body);
        res.redirect('/mascotas');
    } catch (error) { next(error); }
};

exports.formularioEditar = async (req, res) => {
    try {
        const mascota = await Mascota.findByPk(req.params.id); // Busca por ID
        if (!mascota) return res.status(404).send('Mascota no encontrada');
        res.render('mascotas/editar', { mascota });
    } catch (error) {
        res.status(500).send('Error al cargar datos: ' + error.message);
    }
};

exports.actualizarMascota = async (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const mascota = { id: req.params.id,...req.body };
        return res.render('mascotas/editar', { errores: errores.array(), mascota });
    }
    try {
        await Mascota.update(req.body, { where: { id: req.params.id } });
        res.redirect('/mascotas');
    } catch (error) { next(error); }
};

exports.borrarMascota = async (req, res) => {
    try {
        await Mascota.destroy({ where: { id: req.params.id } });
        res.redirect('/mascotas');
    } catch (error) {
        res.status(500).send('Error al borrar: ' + error.message);
    }
};

exports.verDetalle = async (req, res) => {
    try {
        const mascota = await Mascota.findByPk(req.params.id);
        if (!mascota) return res.status(404).send('No encontrada');
        res.render('mascotas/detalle', { mascota });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
};