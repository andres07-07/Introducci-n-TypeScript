
import { pool } from '../../../database/conexion.js';
import { crearExcel } from '../../../services/service.excel.js'; 
import path from 'path';
import fs from 'fs';

export const obtenerActividadesAgrupadas = async (req, res) => {
    try {
        const query = `
            SELECT
                ta.nombre_tipo_actividad AS actividad,
                EXTRACT(DAY FROM a.fecha_actividad)::INT AS dia,
                SUM(EXTRACT(EPOCH FROM a.tiempo_actividad::TIME) / 60)::INT AS tiempo_minutos
            FROM actividades a
            JOIN tipos_actividades ta ON a.id_tipo_actividad_fk = ta.id_tipo_actividad_pk
            GROUP BY actividad, dia
            ORDER BY actividad, dia;
        `;

        const { rows } = await pool.query(query);

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'no se encontraron actividades', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'error al obtener las actividades: ' + error.message, status: 500 });
    }
};

export const reportarActividadExcel = async (req, res) => {
    try {
        const query = `
            SELECT
                ta.nombre_tipo_actividad AS actividad,
                EXTRACT(DAY FROM a.fecha_actividad)::INT AS dia,
                SUM(EXTRACT(EPOCH FROM a.tiempo_actividad::TIME) / 60)::INT AS tiempo_minutos
            FROM actividades a
            JOIN tipos_actividades ta ON a.id_tipo_actividad_fk = ta.id_tipo_actividad_pk
            GROUP BY actividad, dia
            ORDER BY actividad, dia;
        `;
        const { rows } = await pool.query(query);

        // Agrupar por actividad y días
        const agrupados = {};
        rows.forEach(({ actividad, dia, tiempo_minutos }) => {
            if (!agrupados[actividad]) agrupados[actividad] = Array(31).fill(0);
            agrupados[actividad][dia - 1] = tiempo_minutos;
        });

        // Preparar filas para Excel
        const filasExcel = [];
        for (const [actividad, tiempos] of Object.entries(agrupados)) {
            const total = tiempos.reduce((a, b) => a + (b || 0), 0);
            filasExcel.push([actividad, ...tiempos, total]);
        }

        // Agregar fila total
        const totales = Array(31).fill(0);
        filasExcel.forEach(([, ...tiempos]) => {
            tiempos.forEach((min, i) => {
                totales[i] += min || 0;
            });
        });
        const granTotal = totales.reduce((a, b) => a + b, 0);
        filasExcel.push(['TOTAL TIEMPO', ...totales, granTotal]);

        // Generar encabezados
        const columnas = ['ACTIVIDAD', ...Array.from({ length: 31 }, (_, i) => `${i + 1}`), 'TOTAL TIEMPO'];

        // Fecha actual para nombre
        const fecha = new Date();
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        const fileName = `reporte-actividad-${yyyy}-${mm}-${dd}.xlsx`;

        // Carpeta personalizada
        const carpeta = path.join('private', 'reportes', 'excel', 'actividad');

        // Crear Excel reutilizando el servicio
        const filePath = await crearExcel(fileName, filasExcel, columnas, carpeta);

        // Verificar existencia
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ message: 'El archivo no fue generado correctamente.' });
        }

        // Descargar
        res.download(filePath, fileName, (e) => {
            if (e) {
                console.error("❌ Error al descargar archivo:", err);
                return res.status(500).send("Error al descargar el archivo");
            }
            // Limpieza opcional
            /*
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error("❌ Error al eliminar archivo:", unlinkErr);
            });
            */
        });
    } catch (e) {
        console.error("🛑 Error al generar reporte:", e);
        res.status(500).json({ message: 'Error al generar el reporte: ' + e.message });
    }
};
