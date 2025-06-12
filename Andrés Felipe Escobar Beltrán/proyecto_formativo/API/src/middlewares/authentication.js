import jwt from 'jsonwebtoken';
import { pool } from '../database/conexion.js';;
import { createClient } from 'redis';

const redisClient = createClient({
host: 'localhost',
port: 6379,
db: 1 // Cambia el número de la base de datos según sea necesario
});

redisClient.on('connect', () => {
console.log('Conectado a Redis');
});

redisClient.connect().catch((e) => {
console.error('Error al conectar con Redis:', e.message);
});

export const iniciarSesion = async (req, res) => {
try {
const { login, password } = req.body;

    const result = await pool.query(
        `SELECT 
            u.dni_usuario_pk,
            u.nombre_usuario,
            u.apellido_usuario,
            u.telefono_usuario,
            u.id_rol_fk,
            u.correo_usuario,
            r.nombre_rol
        FROM usuarios u
        JOIN roles r ON u.id_rol_fk = r.id_rol_pk
        WHERE u.contrasena_usuario = $1 AND u.correo_usuario = $2`,
        [password, login]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no autorizado', status: 404 });
    }

    const usuario = result.rows[0];

    const token = jwt.sign(
        {
            identificacion: usuario.dni_usuario_pk,
            nombre: usuario.nombre_usuario,
            correo: usuario.correo_usuario,
            rol: usuario.nombre_rol,
        },
        'secreto',
        { expiresIn: '12h' }
    );

    await redisClient.set(`token:${usuario.dni_usuario_pk}`, token, {
        EX: 12 * 60 * 60
    });

    res.status(200).json({ usuario, token });
} catch (e) {
    console.error('Error en el inicio de sesión:', e);
    res.status(500).json({ message: 'Error al realizar la búsqueda', error: e.message });
}


};

export const cerrarSesion = async (req, res) => {
try {
const autheader = req.headers['authorization'];


    if (!autheader) {
        return res.status(403).json({ message: 'No se envió el token' });
    }

    const token = autheader.split(' ')[1];

    const decoded = jwt.verify(token, 'secreto');
    const id_usuario = decoded.identificacion;

    await redisClient.del(`token:${id_usuario}`);

    await redisClient.set(`blacklist:${token}`, 'revocado', 'EX', 12 * 60 * 60);

    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
} catch (e) {
    console.error('Error al cerrar sesión:', e);
    res.status(500).json({ message: 'Error al cerrar sesión', error: e.message });
}


};

export const verificarToken = async (req, res, next) => {


try {
    const autheader = req.headers['authorization'];

    if (!autheader || !autheader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado o en formato incorrecto' });
    }

    const token = autheader.split(' ')[1];
    console.log(` ${token.substring(0, 10)}...`);

    const secretKey = process.env.JWT_SECRET || 'secreto';
    const redisKey = `blacklist:${token}`; 

    try {
        console.log(`Verificando blacklist en Redis con clave: '${redisKey}'`);
        const blacklistedValue = await redisClient.get(redisKey);

        if (blacklistedValue !== null) {
            
            console.log(`Verificación fallida: Token encontrado en blacklist. Valor en Redis: '${blacklistedValue}'`);
            return res.status(401).json({ message: 'Acceso no autorizado: Token revocado (blacklist)' });
        } else {
            
            console.log("Token NO encontrado en blacklist (clave no existe en Redis).");
        }
    } catch (redisError) {
        return res.status(500).json({ message: 'Error interno al verificar estado del token con Redis' });
    }

    console.log("Procediendo a verificar firma y expiración del token JWT...");
    jwt.verify(token, secretKey, (e, decoded) => {
        if (e) {
            // El token es inválido (firma incorrecta) o ha expirado
            console.error(`Verificación JWT fallida: ${e.message} (Code: ${e.name})`);

            let message = 'Acceso no autorizado: Token inválido';
            if (e.name === 'TokenExpiredError') {
                message = 'Acceso no autorizado: Token expirado';
            } else if (e.name === 'JsonWebTokenError') {
                message = 'Acceso no autorizado: Token malformado o firma inválida';
            }
            return res.status(401).json({ message: message, code: e.name });
        }

        console.log(`Token verificado exitosamente (JWT Válido). Usuario: ${decoded.identificacion}`);
        req.usuario = decoded;

        console.log("Pasando al siguiente middleware/ruta.");
        next();
    });

} catch (e) {
    console.error('Error inesperado en verificarTokenRedis:', e);
    res.status(500).json({ message: 'Error interno del servidor durante la verificación del token', error: e.message });
}
console.log("--- Fin verificación de token ---");


};

export const autenticacion = async (req, res) => {

};


import nodemailer from 'nodemailer';

export const solicitarRecuperacion = async (req, res) => {
    try {
        const correo_usuario = req.body.correo_usuario.trim().toLowerCase();
        const result = await pool.query('SELECT * FROM usuarios WHERE correo_usuario = $1', [correo_usuario]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        await redisClient.set(`recuperacion:${correo_usuario}`, codigo, { EX: 600 });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bx57599@gmail.com',
                pass: 'pate fszz ysbu jkfy'
            }
        });

        await transporter.sendMail({
            from: 'TU_CORREO@gmail.com',
            to: correo_usuario,
            subject: 'Código de recuperación',
            text: `Tu código de recuperación es: ${codigo}`
        });

        res.status(200).json({ message: 'Código enviado al correo' });
    } catch (e) {
        res.status(500).json({ message: 'Error al solicitar recuperación: ' + e.message });
    }
};


export const cambiarContrasenaConCodigo = async (req, res) => {
    try {
        const { correo_usuario, codigo, nueva_contrasena } = req.body;

        const codigoGuardado = await redisClient.get(`recuperacion:${correo_usuario}`);
        if (!codigoGuardado || codigoGuardado !== codigo) {
            return res.status(400).json({ message: 'Código incorrecto o expirado' });
        }

        await pool.query('UPDATE usuarios SET contrasena_usuario = $1 WHERE correo_usuario = $2', [nueva_contrasena, correo_usuario]);

        await redisClient.del(`recuperacion:${correo_usuario}`);

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (e) {
        res.status(500).json({ message: 'Error al cambiar contraseña: ' + e.message });
    }
};
