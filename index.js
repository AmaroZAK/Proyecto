// index.js - CON IMPORT
import express from 'express';
import { pool } from './src/Database/ConnecionMysql.js';

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba 
app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando!');
});

// Ruta para obtener usuarios desde MySQL
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

// Ruta para agregar usuario
app.post('/usuarios', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
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

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

