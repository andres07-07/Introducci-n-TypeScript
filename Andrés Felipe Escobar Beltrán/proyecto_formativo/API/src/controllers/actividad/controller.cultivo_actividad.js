import { pool } from '../../database/conexion.js';

export const listarCultivosActividades = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Cultivos_actividades');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron cultivos_actividades registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const buscarCultivosActividadesPorId = async (req, res) => {
    try {
        const id_cultivo_actividad_pk = req.params.id_cultivo_actividad_pk;
        const result = await pool.query('SELECT * FROM Cultivos_actividades WHERE id_cultivo_actividad_pk = $1', [id_cultivo_actividad_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron cultivos_actividades registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const registrarCultivosActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { id_cultivo_actividad_pk, id_cultivo_fk, id_actividad_fk } = req.body;
        const sql = 'INSERT INTO Cultivos_actividades (id_cultivo_fk, id_actividad_fk) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(sql, [id_cultivo_actividad_pk, id_cultivo_fk, id_actividad_fk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron cultivos_actividades registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const actualizarCultivosActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { id_cultivo_fk, id_actividad_fk } = req.body;
        const sql = 'UPDATE Cultivos_actividades SET id_cultivo_fk = $1, id_actividad_fk = $2 WHERE id_cultivos_actividades_pk = $3 RETURNING *'
        const result = await pool.query(sql, [id_cultivo_fk, id_actividad_fk, id_cultivos_actividades_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Datos actualizados con exito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontraron cultivos_actividades registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const eliminarCultivosActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const id_cultivo_actividad_pk = req.params.id_cultivo_actividad_pk;
        const result = await pool.query('DELETE FROM Cultivos_actividades WHERE id_cultivo_actividad_pk = $1 RETURNING *', [id_cultivo_actividad_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Datos eliminados con exito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontraron cultivos_actividades registradas', status: 404 });
        }

    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};
