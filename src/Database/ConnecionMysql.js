import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: "localhost",
    port: 3306,
    database: "proyecto", 
    user: "root",
    password: ""
});

// 👇 FUNCIÓN PARA VERIFICAR CONEXIÓN (opcional pero útil)
export const verificarConexion = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        connection.release();
        return true;
    } catch (err) {
        console.error('❌ Error de conexión a MySQL:', err.message);
        return false;
    }
};

// Verificar conexión al iniciar (pero dentro de una función async)
verificarConexion();