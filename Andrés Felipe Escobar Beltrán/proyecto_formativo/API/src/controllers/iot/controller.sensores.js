import { pool } from '../../database/conexion.js';

export const listarSensores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sensores');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron sensores registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarSensorporid = async (req, res) => {
    try {
        const id_sensor_pk = req.params.id_sensor_pk;
        const result = await pool.query('SELECT * FROM sensores WHERE id_sensor_pk = $1', [id_sensor_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró el sensor', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarSensores = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { id_sensor_pk, nombre_sensor, fecha_inicio_sensor, fecha_fin_sensor, id_cultivo_fk, id_tipo_sensor_fk } = req.body;
        const sql = `INSERT INTO sensores (id_sensor_pk, nombre_sensor, fecha_inicio_sensor, fecha_fin_sensor, id_cultivo_fk,id_tipo_sensor_fk)
                    VALUES ($1, $2, $3, $4, $5,$6)`;
        const result = await pool.query(sql, [id_sensor_pk, nombre_sensor, fecha_inicio_sensor, fecha_fin_sensor, id_cultivo_fk, id_tipo_sensor_fk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el sensor', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el sensor', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarSensor = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { nombre_sensor, fecha_inicio_sensor, fecha_fin_sensor, id_cultivo_fk, id_tipo_sensor_fk } = req.body;
        const id_sensor_pk = req.params.id_sensor_pk;
        const sql = `UPDATE sensores SET nombre_sensor = $1, fecha_inicio_sensor = $2, fecha_fin_sensor = $3, id_cultivo_fk=$4, id_tipo_sensor_fk=$5
                    WHERE id_sensor_pk = $6`;
        const result = await pool.query(sql, [nombre_sensor, fecha_inicio_sensor, fecha_fin_sensor, id_sensor_pk, id_cultivo_fk, id_tipo_sensor_fk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el sensor', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el sensor', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarSensor = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_sensor_pk = req.params.id_sensor_pk;
        const sql = 'DELETE FROM sensores WHERE id_sensor_pk = $1';
        const result = await pool.query(sql, [id_sensor_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el sensor', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el sensor', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al eliminar: ' + e.message, status: 500 });
    }
};
