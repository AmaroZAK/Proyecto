import express from 'express';
import { pool } from './Database/ConnecionMysql.js';
import cors from 'cors'; 

const app = express();
const port = 3000;

// 👇 CONFIGURACIÓN MEJORADA DE CORS
// 👇 CONFIGURACIÓN CORS MÁS PERMISIVA PARA MÓVILES
app.use(cors({
  origin: '*', // Temporalmente permite todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'Accept', 'Origin'],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// 👇 MANEJO EXPLÍCITO DE OPTIONS (CRÍTICO PARA MÓVILES)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');
  res.status(204).send();
});

app.use(express.json());

// 👇 MIDDLEWARE DE LOGS MEJORADO
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  console.log('📍 Origen:', req.headers.origin || req.headers.host);
  console.log('📦 Body:', req.body);
  next();
});

app.get('/', (req, res) => {
  console.log('✅ GET / recibido desde:', req.headers.origin);
  res.json({ 
    message: '¡Servidor Express funcionando!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.post('/usuarios', async (req, res) => {
  console.log('📝 POST /usuarios recibido');
  
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "El correo y la contraseña son obligatorios"
      });
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      return res.status(400).json({
        success: false,
        message: "Formato de correo no válido"
      });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    console.log('✅ Validaciones pasadas, insertando en BD...');
    const [result] = await pool.query(
      'INSERT INTO login (correo, contrasena) VALUES (?, ?)',
      [correo, contrasena]
    );

    console.log('✅ Usuario insertado con ID:', result.insertId);
    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      id: result.insertId

    });
  } catch (error) {
    console.error('❌ Error en servidor:', error);
    
    // 👇 Manejo específico de errores de MySQL
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`🌐 Accesible desde ngrok: https://joan-quintan-umbilically.ngrok-free.dev`);
  console.log(`📱 Listo para conexiones móviles`);
});