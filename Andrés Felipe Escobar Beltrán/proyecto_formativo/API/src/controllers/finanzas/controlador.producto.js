import { pool } from '../../database/conexion.js';

// Listar productos
export const listarProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron productos registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

// Buscar producto por ID
export const buscarProductoPorId = async (req, res) => {
    try {
        const id_producto_pk = req.params.id_producto_pk;
        const result = await pool.query('SELECT * FROM productos WHERE id_producto_pk = $1', [id_producto_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontró el producto', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

// Registrar producto
export const registrarProducto = async (req, res) => {
    try {
        const { id_producto_pk, nombre_producto, descripcion_producto, precio_producto, stock_producto, fecha_ingreso_producto, fecha_caducidad_producto, id_cultivo_fk } = req.body;
        const sql = `INSERT INTO productos (id_producto_pk, nombre_producto, descripcion_producto, precio_producto, stock_producto, fecha_ingreso_producto, fecha_caducidad_producto, id_cultivo_fk)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        const result = await pool.query(sql, [id_producto_pk, nombre_producto, descripcion_producto, precio_producto, stock_producto, fecha_ingreso_producto, fecha_caducidad_producto, id_cultivo_fk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se registró el producto', status: 200 });
        } else {
            res.status(404).json({ message: 'No se registró el producto', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar el registro: ' + e.message, status: 500 });
    }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
    try {
        const { nombre_producto, descripcion_producto, precio_producto, stock_producto, fecha_ingreso_producto, fecha_caducidad_producto, id_cultivo_fk } = req.body;
        const id_producto_pk = req.params.id_producto_pk;
        const sql = `UPDATE productos SET nombre_producto = $1, descripcion_producto = $2, precio_producto = $3, stock_producto = $4, fecha_ingreso_producto = $5, fecha_caducidad_producto = $6, id_cultivo_fk = $7
                    WHERE id_producto_pk = $8`;
        const result = await pool.query(sql, [nombre_producto, descripcion_producto, precio_producto, stock_producto, fecha_ingreso_producto, fecha_caducidad_producto, id_cultivo_fk, id_producto_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el producto', status: 200 });
        } else {
            res.status(404).json({ message: 'No se actualizó el producto', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la actualización: ' + e.message, status: 500 });
    }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
    try {
        const id_producto_pk = req.params.id_producto_pk;
        const sql = 'DELETE FROM productos WHERE id_producto_pk = $1';
        const result = await pool.query(sql, [id_producto_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó el producto', status: 200 });
        } else {
            res.status(404).json({ message: 'No se eliminó el producto', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar: ' + e.message, status: 500 });
    }
};