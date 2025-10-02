import express from 'express';
import { pool } from './src/Database/ConnecionMysql.js';
import cors from 'cors'; // 👈 AGREGAR ESTA IMPORTACIÓN

const app = express();
const port = 3000;

// 👇 AGREGAR CORS - ESENCIAL PARA REACT NATIVE
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba 
app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando!');
});

app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM login');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/usuarios', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // 🔹 Validaciones simples
        if (!correo || !contrasena) {
            return res.status(400).json({
                success: false,
                message: "El correo y la contraseña son obligatorios"
            });
        }

        // 🔹 Validar formato de correo
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            return res.status(400).json({
                success: false,
                message: "Formato de correo no válido"
            });
        }

        // 🔹 Validar longitud mínima de contraseña
        if (contrasena.length < 6) {
            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        // Si pasa las validaciones → insertar
        const [result] = await pool.query(
            'INSERT INTO login (correo, contrasena) VALUES (?, ?)',
            [correo, contrasena]
        );

        res.json({
            success: true,
            message: 'Usuario agregado',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 👇 ESCUCHAR EN TODAS LAS INTERFACES
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📱 Accesible desde Android: http://10.0.2.2:${port}`);
});