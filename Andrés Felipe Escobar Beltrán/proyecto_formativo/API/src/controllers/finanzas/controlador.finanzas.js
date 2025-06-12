import { pool } from '../../database/conexion.js';


export const calcularRentabilidadCultivo = async (req, res) => {
    try {
        const id_cultivo_pk = req.params.id_cultivo_pk;

     const sql = `
    SELECT
    c.id_cultivo_pk,
    c.descripcion_cultivo,
    (
        SELECT COALESCE(SUM(v.cantidad * v.precio_unitario), 0)
        FROM productos p2
        JOIN movimientos_productos mp2 ON mp2.id_producto_fk = p2.id_producto_pk
        JOIN ventas v ON v.id_movimiento_producto_fk = mp2.id_movimiento_producto_pk
        WHERE p2.id_cultivo_fk = c.id_cultivo_pk
    ) AS ingresos,
    COALESCE(SUM(mi.cantidad * i.costo_insumo), 0) AS costo_insumo_total,
    COALESCE(SUM(mi.cantidad), 0) AS total_cantidad_insumos,
    COALESCE(SUM(EXTRACT(EPOCH FROM a.tiempo_actividad::interval) / 60), 0) AS total_minutos_mano_obra,
    COALESCE(SUM(EXTRACT(EPOCH FROM a.tiempo_actividad::interval) / 60) * 29.86, 0) AS costo_mano_obra,
    (COALESCE(SUM(EXTRACT(EPOCH FROM a.tiempo_actividad::interval) / 60) * 29.86, 0)
     + COALESCE(SUM(mi.cantidad * i.costo_insumo), 0)) AS total_gastos,
    (
      (
        SELECT COALESCE(SUM(v.cantidad * v.precio_unitario), 0)
        FROM productos p2
        JOIN movimientos_productos mp2 ON mp2.id_producto_fk = p2.id_producto_pk
        JOIN ventas v ON v.id_movimiento_producto_fk = mp2.id_movimiento_producto_pk
        WHERE p2.id_cultivo_fk = c.id_cultivo_pk
      )
      - (
          COALESCE(SUM(EXTRACT(EPOCH FROM a.tiempo_actividad::interval) / 60) * 29.86, 0)
          + COALESCE(SUM(mi.cantidad * i.costo_insumo), 0)
        )
    ) AS utilidad_neta,
    (
      (
        SELECT COALESCE(SUM(v.cantidad * v.precio_unitario), 0)
        FROM productos p2
        JOIN movimientos_productos mp2 ON mp2.id_producto_fk = p2.id_producto_pk
        JOIN ventas v ON v.id_movimiento_producto_fk = mp2.id_movimiento_producto_pk
        WHERE p2.id_cultivo_fk = c.id_cultivo_pk
      )
      / NULLIF(
          COALESCE(SUM(EXTRACT(EPOCH FROM a.tiempo_actividad::interval) / 60) * 29.86, 0)
          + COALESCE(SUM(mi.cantidad * i.costo_insumo), 0)
        , 0)
    ) AS indice_rentabilidad
FROM cultivos c
LEFT JOIN productos p ON p.id_cultivo_fk = c.id_cultivo_pk
LEFT JOIN movimientos_productos mp ON mp.id_producto_fk = p.id_producto_pk
LEFT JOIN Cultivos_actividades ca ON ca.id_cultivo_fk = c.id_cultivo_pk
LEFT JOIN actividades a ON a.id_actividad_pk = ca.id_actividad_fk
LEFT JOIN movimientos_insumos mi ON mi.id_actividad_fk = a.id_actividad_pk
LEFT JOIN insumos i ON i.id_insumo_pk = mi.id_insumo_fk
WHERE c.id_cultivo_pk = $1
GROUP BY c.id_cultivo_pk, c.descripcion_cultivo
`;
        const result = await pool.query(sql, [id_cultivo_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontró el cultivo o no hay datos financieros', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al calcular rentabilidad: ' + e.message, status: 500 });
    }
};