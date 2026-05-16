const cookieParser = require('cookie-parser'); // Nuevo: Maneja el "pase digital" (JWT)
const express = require('express');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/database');

// Importación de Rutas y Portero de Seguridad
const mascotaRoutes = require('./routes/mascotas');
const authRoutes = require('./routes/auth'); // Rutas de acceso (login/logout) [3]
const { protegerRuta } = require('./middlewares/auth'); // Middleware de protección [2]
const usuarioRoutes = require('./routes/usuarios');
const app = express();

// Capturadores de errores críticos globales
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Error No Manejado en una Promesa:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('❌ Error Crítico del Sistema:', err);
});

// Configuración visual (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1. Middlewares (Procesadores de datos) - El orden importa
// Middleware para que el usuario esté disponible en todas las vistas EJS
app.use((req, res, next) => {
    const jwt = require('jsonwebtoken');
    const token = req.cookies?.token;
    if (token) {
        try {
            const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_geos');
            res.locals.user = verificado; // Ahora <%= user %> funcionará en cualquier EJS [4]
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Definición de Rutas
app.use(cookieParser()); // Vital para leer el token de seguridad guardado en el navegador [1]
app.use('/', authRoutes); // Rutas públicas (Login y Registro)

// Rutas protegidas: Solo personal logueado puede entrar a /mascotas [2, 3]
app.use('/mascotas', protegerRuta, mascotaRoutes);
app.use('/usuarios', usuarioRoutes); 

app.get('/', (req, res) => {
    res.redirect('/mascotas');
});

// 3. Conexión a Base de Datos y Encendido
async function iniciarVeteGeos() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida con PostgreSQL.');

        // Sincronización segura: no borra datos existentes
        await sequelize.sync({ force: false });
        console.log('✅ Base de datos de Geos lista.');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor de Veterinaria Geos activo en: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error.message);
    }
}

// Middleware de manejo de errores global (debe tener 4 parámetros)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        mensaje: 'Lo sentimos, hubo un problema técnico interno.' 
    });
});

iniciarVeteGeos();