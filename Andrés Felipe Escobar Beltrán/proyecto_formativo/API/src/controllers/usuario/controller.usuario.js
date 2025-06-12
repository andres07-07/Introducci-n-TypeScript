import { pool } from '../../database/conexion.js';

export const listarUsuario = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const result = await pool.query('SELECT * FROM usuarios');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron usuarios registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarUsuarioporid = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const dni_usuario_pk = req.params.dni_usuario_pk;
        const result = await pool.query('SELECT * FROM usuarios WHERE dni_usuario_pk = $1', [dni_usuario_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró el usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarUsuario = async (req, res) => {
    try {
        const { dni_usuario_pk, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, contraseña_usuario, estado_usuario, id_rol } = req.body;
        const sql = `INSERT INTO usuarios (dni_usuario_pk, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, contrasena_usuario, estado_usuario, id_rol_fk)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        const result = await pool.query(sql, [dni_usuario_pk, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, contraseña_usuario, estado_usuario, id_rol]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, contraseña_usuario, estado_usuario, id_rol } = req.body;
        const dni_usuario_pk = req.params.dni_usuario_pk;
        const sql = `UPDATE usuarios SET nombre_usuario = $1, apellido_usuario = $2, telefono_usuario = $3, correo_usuario = $4, contrasena_usuario = $5, estado_usuario = $6, id_rol_fk = $7
                    WHERE dni_usuario_pk = $8`;
        const result = await pool.query(sql, [nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, contraseña_usuario, estado_usuario, id_rol, dni_usuario_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const dni_usuario_pk = req.params.dni_usuario_pk;
        const sql = 'DELETE FROM usuarios WHERE dni_usuario_pk = $1';
        const result = await pool.query(sql, [dni_usuario_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al eliminar: ' + e.message, status: 500 });
    }
};
