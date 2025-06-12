import { pool } from '../../database/conexion.js';

// Listar ventas
export const listarVentas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ventas');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron ventas registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

// Buscar venta por ID
export const buscarVentaPorId = async (req, res) => {
    try {
        const id_ventas_pk = req.params.id_ventas_pk;
        const result = await pool.query('SELECT * FROM ventas WHERE id_ventas_pk = $1', [id_ventas_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontró la venta', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

// Registrar venta
export const registrarVenta = async (req, res) => {
    try {
        const { id_ventas_pk, id_movimiento_producto_fk, cantidad, precio_unitario, fecha } = req.body;
        const sql = `INSERT INTO ventas (id_ventas_pk, id_movimiento_producto_fk, cantidad, precio_unitario, fecha)
                    VALUES ($1, $2, $3, $4, $5)`;
        const result = await pool.query(sql, [id_ventas_pk, id_movimiento_producto_fk, cantidad, precio_unitario, fecha]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se registró la venta', status: 200 });
        } else {
            res.status(404).json({ message: 'No se registró la venta', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar el registro: ' + e.message, status: 500 });
    }
};

// Actualizar venta
export const actualizarVenta = async (req, res) => {
    try {
        const { id_movimiento_producto_fk, cantidad, precio_unitario, fecha } = req.body;
        const id_ventas_pk = req.params.id_ventas_pk;
        const sql = `UPDATE ventas SET id_movimiento_producto_fk = $1, cantidad = $2, precio_unitario = $3, fecha = $4
                                        {
                      "id_ventas_pk": 1,
                      "id_movimiento_producto_fk": 10,
                      "cantidad": 5,
                      "precio_unitario": 100,
                      "fecha": "2025-05-16"
                    }WHERE id_ventas_pk = $5`;
        const result = await pool.query(sql, [id_movimiento_producto_fk, cantidad, precio_unitario, fecha, id_ventas_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó la venta', status: 200 });
        } else {
            res.status(404).json({ message: 'No se actualizó la venta', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la actualización: ' + e.message, status: 500 });
    }
};

// Eliminar venta
export const eliminarVenta = async (req, res) => {
    try {
        const id_ventas_pk = req.params.id_ventas_pk;
        const sql = 'DELETE FROM ventas WHERE id_ventas_pk = $1';
        const result = await pool.query(sql, [id_ventas_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó la venta', status: 200 });
        } else {
            res.status(404).json({ message: 'No se eliminó la venta', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar: ' + e.message, status: 500 });
    }
};