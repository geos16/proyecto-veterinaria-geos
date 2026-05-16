const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.formularioLogin = (req, res) => {
    res.render('auth/login');
};

exports.formularioRegistro = (req, res) => {
    res.render('auth/registro');
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ where: { username } });
        if (!usuario) return res.send('Usuario no encontrado');

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.send('Contraseña incorrecta');

        const token = jwt.sign(
            { id: usuario.id, username: usuario.username, role: usuario.role }, 
            process.env.JWT_SECRET || 'secreto_geos', 
            { expiresIn: '2h' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/mascotas');
    } catch (error) {
        res.status(500).send('Error en el login');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};