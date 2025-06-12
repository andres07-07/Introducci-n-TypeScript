import { pool } from '../../database/conexion.js';

export const listarUsuarioActividad = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios_actividades');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron actividades de usuarios registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarUsuarioActividadporid = async (req, res) => {
    try {
        const id_usuarios_actividades_pk = req.params.id_usuarios_actividades_pk;
        const result = await pool.query('SELECT * FROM usuarios_actividades WHERE id_usuarios_actividades_pk = $1', [id_usuarios_actividades_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró la actividad del usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarUsuarioActividad = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { id_usuarios_actividades_pk, dni_usuario, id_actividad } = req.body;
        const sql = `INSERT INTO usuarios_actividades (id_usuarios_actividades_pk, dni_usuario_fk, id_actividad_fk)
                    VALUES ($1, $2, $3)`;
        const result = await pool.query(sql, [id_usuarios_actividades_pk, dni_usuario, id_actividad]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró la actividad de usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró la actividad usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarUsuarioActividad = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { dni_usuario, id_actividad } = req.body;
        const id_usuarios_actividades_pk = req.params.id_usuarios_actividades_pk;
        const sql = `UPDATE usuarios_actividades SET dni_usuario_fk = $1, id_actividad_fk = $2
                    WHERE id_usuarios_actividades_pk = $3`;
        const result = await pool.query(sql, [dni_usuario, id_actividad, id_usuarios_actividades_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó la actividad del usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó la actividad del usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarUsuarioActividad = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const id_usuarios_actividades_pk = req.params.id_usuarios_actividades_pk;
        const sql = 'DELETE FROM usuarios_actividades WHERE id_usuarios_actividades_pk = $1';
        const result = await pool.query(sql, [id_usuarios_actividades_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó la actividad del usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó la actividad del usuario', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al eliminar: ' + e.message, status: 500 });
    }
};
