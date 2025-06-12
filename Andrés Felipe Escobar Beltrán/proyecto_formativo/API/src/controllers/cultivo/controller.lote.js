import { pool } from '../../database/conexion.js';

export const listarLotes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lotes');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron lotes registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarLotePorId = async (req, res) => {
    try {
        const id_lote_pk = req.params.id_lote_pk;
        const result = await pool.query('SELECT * FROM lotes WHERE id_lote_pk = $1', [id_lote_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró el lote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarLote = async (req, res) => {
    try {
        /*
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
*/
        const { area_lote } = req.body;
        const sql = `INSERT INTO lotes (area_lote) VALUES ($1)`;
        const result = await pool.query(sql, [area_lote]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el lote', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el lote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarLote = async (req, res) => {
    try {
        /*
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
*/
        const { area_lote } = req.body;
        const id_lote_pk = req.params.id_lote_pk;
        const sql = `UPDATE lotes SET area_lote = $1 WHERE id_lote_pk = $2`;
        const result = await pool.query(sql, [area_lote, id_lote_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el lote', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el lote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarLote = async (req, res) => {
    try {
        /*
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
*/
        const id_lote_pk = req.params.id_lote_pk;
        const result = await pool.query('DELETE FROM lotes WHERE id_lote_pk = $1', [id_lote_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el lote', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el lote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la eliminación: ' + e.message, status: 500 });
    }
};
