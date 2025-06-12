import { pool } from '../../database/conexion.js';

export const listartipoActividades = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tipos_actividades');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron tipos actividades registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscartipoActividadesporid = async (req, res) => {
    try {
        const id_tipo_actividad_pk = req.params.id_tipo_actividad_pk;
        const result = await pool.query('SELECT * FROM tipos_actividades WHERE id_tipo_actividad_pk = $1', [id_tipo_actividad_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró el tipo de actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrartipoActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores pueden registrar roles' });
        }

        const { id_tipo_actividad_pk, nombre_tipo_actividad } = req.body;
        const sql = `INSERT INTO tipos_actividades (id_tipo_actividad_pk, nombre_tipo_actividad)
                    VALUES ($1, $2)`;
        const result = await pool.query(sql, [id_tipo_actividad_pk, nombre_tipo_actividad]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el tipo de actividad', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el tipo de actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizartipoActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores pueden registrar roles' });
        }

        const { nombre_tipo_actividad } = req.body;
        const id_tipo_actividad_pk = req.params.id_tipo_actividad_pk;
        const sql = `UPDATE tipos_actividades SET nombre_tipo_actividad = $1
                    WHERE id_tipo_actividad_pk = $2`;
        const result = await pool.query(sql, [nombre_tipo_actividad, id_tipo_actividad_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el tipo de actividad', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el tipo de actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminartipoActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_tipo_actividad_pk = req.params.id_tipo_actividad_pk;
        const sql = 'DELETE FROM tipos_actividades WHERE id_tipo_actividad_pk = $1';
        const result = await pool.query(sql, [id_tipo_actividad_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el tipo de actividad', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el tipo de actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al eliminar: ' + e.message, status: 500 });
    }
};
