import { pool } from '../../database/conexion.js';

export const listarRol = async (req, res) => {
    try {
        if (req.usuario.rol.toLowerCase() !== 'administrador') {
            return res.status(403).json({ message: 'acceso denegado: solo administradores' });
        }
        const result = await pool.query('SELECT * FROM roles');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron roles registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarRolporid = async (req, res) => {
    try {
        if (req.usuario.rol.toLowerCase() !== 'administrador') {
            return res.status(403).json({ message: 'acceso denegado: solo administradores' });
        }
        const id_rol_pk = req.params.id_rol_pk;
        const result = await pool.query('SELECT * FROM roles WHERE id_rol_pk = $1', [id_rol_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró el rol', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarRol = async (req, res) => {
    try {
        if (req.usuario.rol.toLowerCase() !== 'administrador') {
            return res.status(403).json({ message: 'acceso denegado: solo administradores' });
        }

        const { id_rol_pk, nombre_rol } = req.body;
        const sql = `INSERT INTO roles (id_rol_pk, nombre_rol) VALUES ($1, $2)`;
        const result = await pool.query(sql, [id_rol_pk, nombre_rol]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el rol', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el rol', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarRol = async (req, res) => {
    try {
        if (req.usuario.rol.toLowerCase() !== 'administrador') {
            return res.status(403).json({ message: 'acceso denegado: solo administradores' });
        }
        const { nombre_rol} = req.body;
        const id_rol_pk = req.params.id_rol_pk;
        const sql = `UPDATE roles SET nombre_rol = $1
                    WHERE id_rol_pk = $2`;
        const result = await pool.query(sql, [nombre_rol,id_rol_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el rol', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el rol', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarRol = async (req, res) => {
    try {
        if (req.usuario.rol.toLowerCase() !== 'administrador') {
            return res.status(403).json({ message: 'acceso denegado: solo administradores' });
        }
        const id_rol_pk = req.params.id_rol_pk;
        const sql = 'DELETE FROM roles WHERE id_rol_pk = $1';
        const result = await pool.query(sql, [id_rol_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el rol', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el rol', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al eliminar: ' + e.message, status: 500 });
    }
};
