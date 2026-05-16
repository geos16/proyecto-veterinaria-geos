const Usuario = require('../models/Usuario');

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.render('usuarios/index', { usuarios });
    } catch (error) {
        res.status(500).send("Error al obtener personal");
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        if (req.params.id == req.user.id) {
            return res.status(400).send("No puedes eliminar tu propia cuenta");
        }
        await Usuario.destroy({ where: { id: req.params.id } });
        res.redirect('/usuarios');
    } catch (error) {
        res.status(500).send("Error al eliminar usuario");
    }
};