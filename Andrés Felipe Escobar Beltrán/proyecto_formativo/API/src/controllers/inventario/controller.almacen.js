import { pool } from '../../database/conexion.js';

export const listarAlmacenes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM almacenes');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron almacenes registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarAlmacenPorId = async (req, res) => {
    try {
        const id_almacen_pk = req.params.id_almacen_pk;
        const result = await pool.query('SELECT * FROM almacenes WHERE id_almacen_pk = $1', [id_almacen_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontró el almacén', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarAlmacen = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { nombre_almacen } = req.body;
        const sql = 'INSERT INTO almacenes (nombre_almacen) VALUES ($1)';
        const result = await pool.query(sql, [nombre_almacen]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se registró el almacén', status: 200 });
        } else {
            res.status(404).json({ message: 'No se registró el almacén', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarAlmacen = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_almacen_pk = req.params.id_almacen_pk;
        const { nombre_almacen } = req.body;
        const sql = 'UPDATE almacenes SET nombre_almacen = $1 WHERE id_almacen_pk = $2';
        const result = await pool.query(sql, [nombre_almacen, id_almacen_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el almacén', status: 200 });
        } else {
            res.status(404).json({ message: 'No se actualizó el almacén', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar: ' + e.message, status: 500 });
    }
};

export const eliminarAlmacen = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_almacen_pk = req.params.id_almacen_pk;
        const sql = 'DELETE FROM almacenes WHERE id_almacen_pk = $1';
        const result = await pool.query(sql, [id_almacen_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó el almacén', status: 200 });
        } else {
            res.status(404).json({ message: 'No se eliminó el almacén', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar: ' + e.message, status: 500 });
    }
};
