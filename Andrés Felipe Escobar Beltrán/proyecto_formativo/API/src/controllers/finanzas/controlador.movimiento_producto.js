import { pool } from '../../database/conexion.js';

// Listar movimientos de productos
export const listarMovimientosProducto = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movimientos_productos');
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Se encontraron movimientos de productos registrados', status: 200, data: result.rows });
        } else {
            res.status(404).json({ message: 'No se encontraron movimientos de productos registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al listar movimientos de productos: ' + e.message, status: 500 });
    }
};

// Buscar movimiento de producto por ID
export const buscarMovimientoProductoPorId = async (req, res) => {
    try {
        const id_movimiento_producto_pk = req.params.id_movimiento_producto_pk;
        const result = await pool.query('SELECT * FROM movimientos_productos WHERE id_movimiento_producto_pk = $1', [id_movimiento_producto_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Se encontró el movimiento de producto', status: 200, data: result.rows });
        } else {
            res.status(404).json({ message: 'No se encontró el movimiento de producto', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar el movimiento de producto: ' + e.message, status: 500 });
    }
};

// Registrar movimiento de producto
export const registrarMovimientoProducto = async (req, res) => {
    try {
        const {
            id_movimiento_producto_pk,
            id_producto_fk,
            id_venta_fk,
            tipo_movimiento,
            cantidad,
            fecha,
            descripcion
        } = req.body;

        const sql = `
            INSERT INTO movimientos_productos (
                id_movimiento_producto_pk,
                id_producto_fk,
                id_venta_fk,
                tipo_movimiento,
                cantidad,
                fecha,
                descripcion
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        const result = await pool.query(sql, [
            id_movimiento_producto_pk,
            id_producto_fk,
            id_venta_fk,
            tipo_movimiento,
            cantidad,
            fecha,
            descripcion
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se registró el movimiento de producto', status: 200 });
        } else {
            res.status(400).json({ message: 'No se pudo registrar el movimiento de producto', status: 400 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al registrar el movimiento de producto: ' + e.message, status: 500 });
    }
};

// Actualizar movimiento de producto
export const actualizarMovimientoProducto = async (req, res) => {
    try {
        const {
            id_producto_fk,
            id_venta_fk,
            tipo_movimiento,
            cantidad,
            fecha,
            descripcion
        } = req.body;

        const id_movimiento_producto_pk = req.params.id_movimiento_producto_pk;

        const sql = `
            UPDATE movimientos_productos SET
                id_producto_fk = $1,
                id_venta_fk = $2,
                tipo_movimiento = $3,
                cantidad = $4,
                fecha = $5,
                descripcion = $6
            WHERE id_movimiento_producto_pk = $7
        `;

        const result = await pool.query(sql, [
            id_producto_fk,
            id_venta_fk,
            tipo_movimiento,
            cantidad,
            fecha,
            descripcion,
            id_movimiento_producto_pk
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el movimiento de producto', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró el movimiento de producto para actualizar', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar el movimiento de producto: ' + e.message, status: 500 });
    }
};

// Eliminar movimiento de producto
export const eliminarMovimientoProducto = async (req, res) => {
    try {
        const id_movimiento_producto_pk = req.params.id_movimiento_producto_pk;
        const sql = 'DELETE FROM movimientos_productos WHERE id_movimiento_producto_pk = $1';
        const result = await pool.query(sql, [id_movimiento_producto_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó el movimiento de producto', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró el movimiento de producto para eliminar', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar el movimiento de producto: ' + e.message, status: 500 });
    }
};