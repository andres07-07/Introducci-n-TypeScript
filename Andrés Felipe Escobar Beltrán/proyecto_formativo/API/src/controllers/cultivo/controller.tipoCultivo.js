import { pool } from '../../database/conexion.js';

export const listarTipoCultivos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tipos_cultivos');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron tipos de cultivos registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarTipoCultivoPorId = async (req, res) => {
    try {
        const id_tipo_cultivo_pk = req.params.id_tipo_cultivo_pk;
        const result = await pool.query('SELECT * FROM tipos_cultivos WHERE id_tipo_cultivo_pk = $1', [id_tipo_cultivo_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró el tipo de cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarTipoCultivo = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { nombre_tipo_cultivo } = req.body;
        const sql = `INSERT INTO tipos_cultivos (nombre_tipo_cultivo) VALUES ($1)`;
        const result = await pool.query(sql, [nombre_tipo_cultivo]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el tipo de cultivo', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el tipo de cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarTipoCultivo = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { nombre_tipo_cultivo } = req.body;
        const id_tipo_cultivo_pk = req.params.id_tipo_cultivo_pk;
        const sql = `UPDATE tipos_cultivos SET nombre_tipo_cultivo = $1 WHERE id_tipo_cultivo_pk = $2`;
        const result = await pool.query(sql, [nombre_tipo_cultivo, id_tipo_cultivo_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el tipo de cultivo', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el tipo de cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarTipoCultivo = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_tipo_cultivo_pk = req.params.id_tipo_cultivo_pk;
        const result = await pool.query('DELETE FROM tipos_cultivos WHERE id_tipo_cultivo_pk = $1', [id_tipo_cultivo_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el tipo de cultivo', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el tipo de cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la eliminación: ' + e.message, status: 500 });
    }
};
