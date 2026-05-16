const jwt = require('jsonwebtoken');

exports.protegerRuta = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) return res.redirect('/login');

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_geos');
        req.user = verificado;
        res.locals.user = verificado;
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

exports.esAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Acceso denegado: Solo para administradores de Geos');
    }
};