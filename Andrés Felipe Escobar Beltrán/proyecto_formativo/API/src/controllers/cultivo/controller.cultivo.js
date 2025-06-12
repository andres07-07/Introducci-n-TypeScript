import { pool } from '../../database/conexion.js';

export const listarCultivos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cultivos');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron cultivos registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarCultivoPorId = async (req, res) => {
    try {
        const id_cultivo_pk = req.params.id_cultivo_pk;
        const result = await pool.query('SELECT * FROM cultivos WHERE id_cultivo_pk = $1', [id_cultivo_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'no se encontró el cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarCultivo = async (req, res) => {
    try {
        /*
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
*/
        const {
            descripcion_cultivo,
            precio_cultivo,
            presentacion_cultivo,
            fecha_inicio_cultivo,
            fecha_fin_cultivo,
            id_sublote_fk,
            id_tipo_cultivo_fk
        } = req.body;

        const sql = `
            INSERT INTO cultivos (
                descripcion_cultivo, precio_cultivo, presentacion_cultivo,
                fecha_inicio_cultivo, fecha_fin_cultivo, id_sublote_fk, id_tipo_cultivo_fk
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        const result = await pool.query(sql, [
            descripcion_cultivo, precio_cultivo, presentacion_cultivo,
            fecha_inicio_cultivo, fecha_fin_cultivo, id_sublote_fk, id_tipo_cultivo_fk
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró el cultivo', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarCultivo = async (req, res) => {
    try {
        /*
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
*/
        const {
            descripcion_cultivo,
            precio_cultivo,
            presentacion_cultivo,
            fecha_inicio_cultivo,
            fecha_fin_cultivo,
            id_sublote_fk,
            id_tipo_cultivo_fk
        } = req.body;
        const id_cultivo_pk = req.params.id_cultivo_pk;

        const sql = `
            UPDATE cultivos
            SET descripcion_cultivo = $1,
                precio_cultivo = $2,
                presentacion_cultivo = $3,
                fecha_inicio_cultivo = $4,
                fecha_fin_cultivo = $5,
                id_sublote_fk = $6,
                id_tipo_cultivo_fk = $7
            WHERE id_cultivo_pk = $8
        `;

        const result = await pool.query(sql, [
            descripcion_cultivo, precio_cultivo, presentacion_cultivo,
            fecha_inicio_cultivo, fecha_fin_cultivo, id_sublote_fk, id_tipo_cultivo_fk,
            id_cultivo_pk
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el cultivo', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarCultivo = async (req, res) => {
    try {
        /*
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
*/
        const id_cultivo_pk = req.params.id_cultivo_pk;
        const result = await pool.query('DELETE FROM cultivos WHERE id_cultivo_pk = $1', [id_cultivo_pk]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el cultivo', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el cultivo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la eliminación: ' + e.message, status: 500 });
    }
};

export const historialCultivoCompleto = async (req, res) => {
    try {
        const { id_cultivo } = req.params;
        const sql = `
            SELECT 
                c.descripcion_cultivo,
                a.nombre_actividad,
                a.fecha_actividad,
                i.nombre_insumo,
                mi.cantidad AS cantidad_insumo,
                mi.unidad AS unidad_insumo,
                mi.tipo_movimiento AS tipo_movimiento_insumo,
                mi.fecha_movimiento AS fecha_movimiento_insumo,
                mi.motivo,
                mi.observaciones,
                p.nombre_producto,
                mp.cantidad AS cantidad_producto,
                mp.tipo_movimiento AS tipo_movimiento_producto,
                mp.fecha AS fecha_movimiento_producto
            FROM cultivos c
            LEFT JOIN Cultivos_actividades ca ON ca.id_cultivo_fk = c.id_cultivo_pk
            LEFT JOIN actividades a ON a.id_actividad_pk = ca.id_actividad_fk
            LEFT JOIN movimientos_insumos mi ON mi.id_actividad_fk = a.id_actividad_pk
            LEFT JOIN insumos i ON i.id_insumo_pk = mi.id_insumo_fk
            LEFT JOIN productos p ON p.id_cultivo_fk = c.id_cultivo_pk
            LEFT JOIN movimientos_productos mp ON mp.id_producto_fk = p.id_producto_pk
            WHERE c.id_cultivo_pk = $1
            ORDER BY a.fecha_actividad ASC, mi.fecha_movimiento ASC, mp.fecha ASC
        `;
        const result = await pool.query(sql, [id_cultivo]);
        res.status(200).json({ historial: result.rows, cantidad: result.rowCount, status: 200 });
    } catch (e) {
        res.status(500).json({ message: 'Error al obtener historial completo: ' + e.message, status: 500 });
    }
};