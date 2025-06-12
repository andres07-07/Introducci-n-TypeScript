import { pool } from '../../database/conexion.js';

export const listarEpas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM epa');
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'se listó las EPAs', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontraron EPAs registradas', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al listar EPAs: ' + error.message, status: 500 });
    }
};

export const buscarEpaPorId = async (req, res) => {
    try {
        const id_epa_pk = req.params.id_epa_pk;
        const result = await pool.query('SELECT * FROM epa WHERE id_epa_pk = $1', [id_epa_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'EPA buscada con éxito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró la EPA con el ID proporcionado', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar EPA por ID: ' + error.message, status: 500 });
    }
};

export const registrarEpa = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { id_cultivo_fk, estado_epa, id_tipo_epa_fk, nombre_epa, descripcion_epa } = req.body;
        const result = await pool.query(
            'INSERT INTO epas (id_cultivo_fk, estado_epa, id_tipo_epa_fk, nombre_epa, descripcion_epa) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_cultivo_fk, estado_epa, id_tipo_epa_fk, nombre_epa, descripcion_epa]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'EPA registrada con éxito', status: 200 });
        } else {
            res.status(400).json({ message: 'No se pudo registrar la EPA', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar EPA: ' + error.message, status: 500 });
    }
};

export const actualizarEpa = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const id_epa_pk = req.params.id_epa_pk;
        const { id_cultivo_fk, estado_epa, id_tipo_epa_fk, nombre_epa, descripcion_epa } = req.body;
        const result = await pool.query(
            'UPDATE epa SET id_cultivo_fk = $1, estado_epa = $2, id_tipo_epa_fk = $3, nombre_epa = $4, descripcion_epa = $5 WHERE id_epa_pk = $6 RETURNING *',
            [id_cultivo_fk, estado_epa, id_tipo_epa_fk, nombre_epa, descripcion_epa, id_epa_pk]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'EPA actualizada con éxito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró la EPA para actualizar', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar EPA: ' + error.message, status: 500 });
    }
};

export const eliminarEpa = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const id_epa_pk = req.params.id_epa_pk;
        const result = await pool.query('DELETE FROM epa WHERE id_epa_pk = $1 RETURNING *', [id_epa_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'EPA eliminada con éxito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró la EPA para eliminar', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar EPA: ' + error.message, status: 500 });
    }
};


export const buscarPorNombreTipoEpa = async (req, res) => {
    try {
        const { nombreTipoepa } = req.params;

        const result = await pool.query(
            `SELECT e.*, t.nombre_tipo_epa 
             FROM epas e
             JOIN tipos_epas t ON e.id_tipo_epa_fk = t.id_tipo_epa_pk
             WHERE LOWER(t.nombre_tipo_epa::text) = LOWER($1)`,
            [nombreTipoepa]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontraron EPAs para ese tipo', status: 404 });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar EPAs por tipo: ' + error.message, status: 500 });
    }
};

export const buscarNombreEspecifico = async (req, res) => {
    try {
        const { nombreTipoepa, nombreEspecifico } = req.params;

        const result = await pool.query(
            `SELECT e.*, t.nombre_tipo_epa 
             FROM epas e
             JOIN tipos_epas t ON e.id_tipo_epa_fk = t.id_tipo_epa_pk
             WHERE LOWER(t.nombre_tipo_epa::text) = LOWER($1) AND LOWER(e.nombre_epa) = LOWER($2)`,
            [nombreTipoepa, nombreEspecifico]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'EPA específica no encontrada', status: 404 });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar EPA específica: ' + error.message, status: 500 });
    }
};
