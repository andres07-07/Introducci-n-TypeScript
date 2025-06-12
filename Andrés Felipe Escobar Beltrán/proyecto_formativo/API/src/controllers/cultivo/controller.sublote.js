import { pool } from '../../database/conexion.js';

export const listarSublotes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Sublotes');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron sublotes registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarSublotePorId = async (req, res) => {
    try {
        const id_sublote_pk = req.params.id_sublote_pk;
        const result = await pool.query('SELECT * FROM Sublotes WHERE id_sublote_pk = $1', [id_sublote_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró el sublote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarSublote = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { longitud_sublote, latitud_sublote, nombre_sublote, descripcion_sublote, id_lote_fk } = req.body;
        const sql = `
            INSERT INTO Sublotes (longitud_sublote, latitud_sublote, nombre_sublote, descripcion_sublote, id_lote_fk)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const result = await pool.query(sql, [longitud_sublote, latitud_sublote, nombre_sublote, descripcion_sublote, id_lote_fk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el sublote', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el sublote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarSublote = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { longitud_sublote, latitud_sublote, nombre_sublote, descripcion_sublote, id_lote_fk } = req.body;
        const id_sublote_pk = req.params.id_sublote_pk;
        const sql = `
            UPDATE Sublotes
            SET longitud_sublote = $1,
                latitud_sublote = $2,
                nombre_sublote = $3,
                descripcion_sublote = $4,
                id_lote_fk = $5
            WHERE id_sublote_pk = $6
        `;
        const result = await pool.query(sql, [longitud_sublote, latitud_sublote, nombre_sublote, descripcion_sublote, id_lote_fk, id_sublote_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el sublote', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el sublote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarSublote = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_sublote_pk = req.params.id_sublote_pk;
        const result = await pool.query('DELETE FROM Sublotes WHERE id_sublote_pk = $1', [id_sublote_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el sublote', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el sublote', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la eliminación: ' + e.message, status: 500 });
    }
};
