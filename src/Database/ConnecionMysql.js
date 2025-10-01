// src/Database/ConnecionMysql.js
import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: "localhost",
    port: 3306,
    database: "proyecto", 
    user: "root",
    password: ""
});

try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa a la base de datos');
    connection.release();
} catch (err) {
    console.error('Error de conexión:', err);
}
