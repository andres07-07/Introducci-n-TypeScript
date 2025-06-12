import { pool } from '../../database/conexion.js';

// Listar movimientos de insumos
export const listarMovimientosInsumo = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movimientos_insumos');
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Se encontraron movimientos de insumos registrados', status: 200, data: result.rows });
        } else {
            res.status(404).json({ message: 'No se encontraron movimientos de insumos registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al listar movimientos de insumos: ' + e.message, status: 500 });
    }
};

// Buscar movimiento de insumo por ID
export const buscarMovimientosInsumoPorId = async (req, res) => {
    try {
        const id_movimiento_insumo_pk = req.params.id_movimiento_insumo_pk;
        const result = await pool.query('SELECT * FROM movimientos_insumos WHERE id_movimiento_insumo_pk = $1', [id_movimiento_insumo_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Se encontró el movimiento de insumo', status: 200, data: result.rows });
        } else {
            res.status(404).json({ message: 'No se encontró el movimiento de insumo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar el movimiento de insumo: ' + e.message, status: 500 });
    }
};

// Registrar movimiento de insumo

export const registrarMovimientosInsumo = async (req, res) => {
    try {
        const {
            id_movimiento_insumo_pk,
            id_insumo_fk,
            tipo_movimiento,  // 'entrada' o 'salida'
            cantidad,
            unidad,
            fecha_movimiento,
            motivo,
            id_actividad_fk,
            observaciones
        } = req.body;

        // 1. Registrar movimiento insumo
        const sqlInsertMovimiento = `
            INSERT INTO movimientos_insumos (
                id_movimiento_insumo_pk,
                id_insumo_fk,
                tipo_movimiento,
                cantidad,
                unidad,
                fecha_movimiento,
                motivo,
                id_actividad_fk,
                observaciones
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        await pool.query(sqlInsertMovimiento, [
            id_movimiento_insumo_pk,
            id_insumo_fk,
            tipo_movimiento,
            cantidad,
            unidad,
            fecha_movimiento,
            motivo,
            id_actividad_fk,
            observaciones
        ]);

        // 2. Obtener stock actual y fecha_caducidad del insumo
        const { rows: insumoRows } = await pool.query(
            `SELECT stock_insumo, fecha_caducidad_insumo FROM insumos WHERE id_insumo_pk = $1`,
            [id_insumo_fk]
        );

        if (insumoRows.length === 0) {
            return res.status(404).json({ message: 'Insumo no encontrado', status: 404 });
        }

        let stockActual = Number(insumoRows[0].stock_insumo);
        const fechaCaducidad = insumoRows[0].fecha_caducidad_insumo;

        // 3. Ajustar stock según tipo_movimiento
        if (tipo_movimiento.toLowerCase() === 'entrada') {
            stockActual += cantidad;
        } else if (tipo_movimiento.toLowerCase() === 'salida') {
            stockActual -= cantidad;
            if (stockActual < 0) stockActual = 0;  // no permitimos stock negativo
        } else {
            return res.status(400).json({ message: 'tipo_movimiento inválido', status: 400 });
        }

        // 4. Calcular nuevo estado_insumo basado en stock
        const stock_minimo = 10; // por ejemplo, o configúralo dinámico si quieres

        let estado_insumo = 'A'; // alto por defecto

        if (stockActual <= stock_minimo) {
            estado_insumo = 'B'; // bajo
        } else if (stockActual <= stock_minimo + 10) {
            estado_insumo = 'M'; // medio
        }

        // 5. Actualizar stock y estado en la tabla insumos
        await pool.query(
            `UPDATE insumos SET stock_insumo = $1, estado_insumo = $2 WHERE id_insumo_pk = $3`,
            [stockActual, estado_insumo, id_insumo_fk]
        );

        // 6. Verificar alertas (stock bajo o caducidad próxima)
        const alertas = [];

        if (estado_insumo === 'B') {
            alertas.push('⚠️ Stock crítico: se necesita reabastecimiento del insumo.');
        }

        if (fechaCaducidad) {
            const hoy = new Date();
            const caducidad = new Date(fechaCaducidad);
            const diffDias = Math.ceil((caducidad - hoy) / (1000 * 60 * 60 * 24));

            if (diffDias <= 7 && diffDias >= 0) {
                alertas.push(`⚠️ Insumo próximo a caducar en ${diffDias} día(s).`);
            }
        }

        // 7. Responder
        return res.status(200).json({
            message: 'Movimiento de insumo registrado y stock actualizado',
            status: 200,
            nuevoStock: stockActual,
            estado_insumo,
            alertas
        });

    } catch (e) {
        return res.status(500).json({
            message: 'Error al registrar el movimiento de insumo: ' + e.message,
            status: 500
        });
    }
};

// Actualizar movimiento de insumo
export const actualizarMovimientosInsumo = async (req, res) => {
    try {
        const {
            id_movimiento_insumo_pk,
            id_insumo_fk,
            tipo_movimiento,
            cantidad,
            unidad,
            fecha_movimiento,
            motivo,
            id_actividad_fk,
            observaciones
        } = req.body;

        const sql = `
            UPDATE movimientos_insumos SET
                id_insumo_fk = $1,
                tipo_movimiento = $2,
                cantidad = $3,
                unidad = $4,
                fecha_movimiento = $5,
                motivo = $6,
                id_actividad_fk = $7,
                observaciones = $8
            WHERE id_movimiento_insumo_pk = $9
        `;

        const result = await pool.query(sql, [
            id_insumo_fk,
            tipo_movimiento,
            cantidad,
            unidad,
            fecha_movimiento,
            motivo,
            id_actividad_fk,
            observaciones,
            id_movimiento_insumo_pk
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el movimiento de insumo', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró el movimiento de insumo para actualizar', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar el movimiento de insumo: ' + e.message, status: 500 });
    }
};

// Eliminar movimiento de insumo
export const eliminarMovimientosInsumo = async (req, res) => {
    try {
        const id_movimiento_insumo_pk = req.params.id_movimiento_insumo_pk;
        const sql = 'DELETE FROM movimientos_insumos WHERE id_movimiento_insumo_pk = $1';
        const result = await pool.query(sql, [id_movimiento_insumo_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó el movimiento de insumo', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró el movimiento de insumo para eliminar', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar el movimiento de insumo: ' + e.message, status: 500 });
    }
};