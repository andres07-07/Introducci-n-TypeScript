import { pool } from '../../../database/conexion.js';
import XlsxPopulate from 'xlsx-populate';
import fs from 'fs';
import path from 'path';

// http://localhost:3000/reporteFinanzas//reporte-finanzas-excel
export const reportarFinanzasExcel = async (req, res) => {
    try {
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
    GROUP BY c.id_cultivo_pk, c.descripcion_cultivo
    `;
        const { rows } = await pool.query(sql);

        const folder = path.join(process.cwd(), 'private', 'excel');
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

        const filePath = path.join(folder, 'Reporte_Finanzas.xlsx');
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);

        // Encabezados modernos
        const columnas = [
            "ID CULTIVO", "DESCRIPCIÓN", "INGRESOS", "COSTO INSUMO TOTAL", "TOTAL CANTIDAD INSUMOS",
            "TOTAL MINUTOS MANO OBRA", "COSTO MANO OBRA", "TOTAL GASTOS", "UTILIDAD NETA", "ÍNDICE RENTABILIDAD"
        ];
        columnas.forEach((col, idx) => {
            sheet.cell(1, idx + 1).value(col)
                .style({
                    bold: true,
                    fill: "305496",
                    fontColor: "FFFFFF",
                    fontSize: 14,
                    fontFamily: "Calibri",
                    horizontalAlignment: "center",
                    border: true
                });
        });
        sheet.row(1).height(28);

        // Llenar datos con filas alternas de color y bordes
        rows.forEach((fila, rowIdx) => {
            const isEven = rowIdx % 2 === 0;
            columnas.forEach((col, colIdx) => {
                const key = Object.keys(fila)[colIdx];
                sheet.cell(rowIdx + 2, colIdx + 1).value(fila[key])
                    .style({
                        fill: isEven ? "E9EDF6" : "FFFFFF",
                        fontFamily: "Calibri",
                        fontSize: 13,
                        border: true,
                        horizontalAlignment: "center"
                    });
            });
        });

        // Ajustar ancho de columnas según el contenido
        const colWidths = columnas.map((col, idx) =>
            Math.max(
                col.length,
                ...rows.map(fila => String(Object.values(fila)[idx] ?? '').length)
            )
        );
        columnas.forEach((_, idx) => {
            sheet.column(idx + 1).width(colWidths[idx] * 1.3 + 3);
        });

        await workbook.toFileAsync(filePath);

        res.download(filePath, 'Reporte_Finanzas.xlsx', (err) => {
            if (err) {
                console.error("Error al descargar el archivo:", err);
                res.status(500).send("Error al descargar el archivo");
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Error al eliminar el archivo:", err);
                });
            }
        });
    } catch (e) {
        res.status(500).json({ message: 'Error al generar el reporte: ' + e.message, status: 500 });
    }
};