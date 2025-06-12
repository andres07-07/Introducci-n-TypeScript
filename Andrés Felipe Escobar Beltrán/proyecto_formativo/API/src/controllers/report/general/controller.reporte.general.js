import { pool } from '../../../database/conexion.js';

export const generarReporteGeneral = async (req, res) => {
    try {
        const reportes = {};

        // 1. Cultivos con su tipo, sublote y lote
        const cultivos = await pool.query(`
            SELECT cu.id_cultivo_pk, cu.descripcion_cultivo, cu.precio_cultivo,
                cu.presentacion_cultivo, cu.fecha_inicio_cultivo, cu.fecha_fin_cultivo,
                tc.nombre_tipo_cultivo, su.nombre_sublote, lo.area_lote
            FROM cultivos cu
            JOIN tipos_cultivos tc ON cu.id_tipo_cultivo_fk = tc.id_tipo_cultivo_pk
            JOIN sublotes su ON cu.id_sublote_fk = su.id_sublote_pk
            JOIN lotes lo ON su.id_lote_fk = lo.id_lote_pk
        `);
        reportes.cultivos = cultivos.rows;

        // 2. Actividades realizadas con sus tipos y usuarios
        const actividades = await pool.query(`
            SELECT a.nombre_actividad, a.descripcion_actividad, a.estado_actividad,
                a.fecha_actividad, ta.nombre_tipo_actividad,
                u.nombre_usuario || ' ' || u.apellido_usuario AS responsable
            FROM actividades a
            JOIN tipos_actividades ta ON a.id_tipo_actividad_fk = ta.id_tipo_actividad_pk
            LEFT JOIN usuarios_actividades ua ON a.id_actividad_pk = ua.id_actividad_fk
            LEFT JOIN usuarios u ON ua.dni_usuario_fk = u.dni_usuario_pk
        `);
        reportes.actividades = actividades.rows;

        // 3. Insumos y movimientos
        const insumos = await pool.query(`
            SELECT i.nombre_insumo, i.stock_insumo, i.unidad_medida_insumo, 
                i.fecha_ingreso_insumo, i.fecha_salida_insumo, i.fecha_caducidad_insumo,
                a.nombre_almacen, c.nombre_categoria
            FROM insumos i
            JOIN almacenes a ON i.id_almacen_fk = a.id_almacen_pk
            JOIN categorias c ON i.id_categoria_fk = c.id_categoria_pk
        `);
        reportes.insumos = insumos.rows;

        const movimientosInsumos = await pool.query(`
            SELECT m.tipo_movimiento, m.cantidad, m.unidad, m.fecha_movimiento, m.motivo,
                i.nombre_insumo, a.nombre_actividad
            FROM movimientos_insumos m
            JOIN insumos i ON m.id_insumo_fk = i.id_insumo_pk
            LEFT JOIN actividades a ON m.id_actividad_fk = a.id_actividad_pk
        `);
        reportes.movimientos_insumos = movimientosInsumos.rows;

        // 4. Productos y ventas
        const productos = await pool.query(`
            SELECT p.nombre_producto, p.precio_producto, p.stock_producto,
                p.fecha_ingreso_producto, p.fecha_caducidad_producto,
                cu.descripcion_cultivo
            FROM productos p
            JOIN cultivos cu ON p.id_cultivo_fk = cu.id_cultivo_pk
        `);
        reportes.productos = productos.rows;

        const ventas = await pool.query(`
            SELECT v.fecha, v.cantidad, v.precio_unitario, mp.tipo_movimiento,
                p.nombre_producto
            FROM ventas v
            JOIN movimientos_productos mp ON v.id_movimiento_producto_fk = mp.id_movimiento_producto_pk
            JOIN productos p ON mp.id_producto_fk = p.id_producto_pk
        `);
        reportes.ventas = ventas.rows;

        // 5. EPAs y tipos
        const epas = await pool.query(`
            SELECT e.nombre_epa, e.descripcion_epa, e.estado_epa,
                te.nombre_tipo_epa, cu.descripcion_cultivo
            FROM epas e
            JOIN tipos_epas te ON e.id_tipo_epa_fk = te.id_tipo_epa_pk
            JOIN cultivos cu ON e.id_cultivo_fk = cu.id_cultivo_pk
        `);
        reportes.epas = epas.rows;

        res.status(200).json({ status: 'success', reportes });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error generando reporte: ' + error.message });
    }
};
