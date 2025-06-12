import { pool } from '../../database/conexion.js';

export const listarInsumos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM insumos');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron insumos registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al listar insumos: ' + e.message, status: 500 });
    }
};

export const buscarInsumoPorId = async (req, res) => {
    try {
        const id_insumo_pk = req.params.id_insumo_pk;
        const result = await pool.query('SELECT * FROM insumos WHERE id_insumo_pk = $1', [id_insumo_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontró el insumo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al buscar el insumo: ' + e.message, status: 500 });
    }
};

export const registrarInsumo = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const {
            nombre_insumo,
            costo_insumo,
            stock_insumo,
            unidad_medida_insumo,
            fecha_ingreso_insumo,
            fecha_salida_insumo,
            fecha_caducidad_insumo,
            id_almacen_fk,
            id_categoria_fk
        } = req.body;

        // Define el stock mínimo permitido
        const stock_minimo = 10;
        let estado_insumo = 'M';

        if (stock_insumo <= stock_minimo) {
            estado_insumo = 'B'; // Bajo
        } else if (stock_insumo <= stock_minimo + 10) {
            estado_insumo = 'M'; // Medio
        } else {
            estado_insumo = 'A'; // Alto
        }

        const sql = `
            INSERT INTO insumos (
                nombre_insumo,
                costo_insumo,
                stock_insumo,
                unidad_medida_insumo,
                estado_insumo,
                fecha_ingreso_insumo,
                fecha_salida_insumo,
                fecha_caducidad_insumo,
                id_almacen_fk,
                id_categoria_fk
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `;

        const result = await pool.query(sql, [
            nombre_insumo,
            costo_insumo,
            stock_insumo,
            unidad_medida_insumo,
            estado_insumo,
            fecha_ingreso_insumo,
            fecha_salida_insumo,
            fecha_caducidad_insumo,
            id_almacen_fk,
            id_categoria_fk
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se registró el insumo', status: 200 });
        } else {
            res.status(404).json({ message: 'No se registró el insumo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al registrar el insumo: ' + e.message, status: 500 });
    }
};

export const actualizarInsumo = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_insumo_pk = req.params.id_insumo_pk;
        const {
            nombre_insumo,
            costo_insumo,
            stock_insumo,
            unidad_medida_insumo,
            estado_insumo,
            fecha_ingreso_insumo,
            fecha_salida_insumo,
            fecha_caducidad_insumo,
            id_almacen_fk,
            id_categoria_fk
        } = req.body;

        const sql = `
            UPDATE insumos SET
                nombre_insumo = $1,
                costo_insumo = $2,
                stock_insumo = $3,
                unidad_medida_insumo = $4,
                estado_insumo = $5,
                fecha_ingreso_insumo = $6,
                fecha_salida_insumo = $7,
                fecha_caducidad_insumo = $8,
                id_almacen_fk = $9,
                id_categoria_fk = $10
            WHERE id_insumo_pk = $11
        `;

        const result = await pool.query(sql, [
            nombre_insumo,
            costo_insumo,
            stock_insumo,
            unidad_medida_insumo,
            estado_insumo,
            fecha_ingreso_insumo,
            fecha_salida_insumo,
            fecha_caducidad_insumo,
            id_almacen_fk,
            id_categoria_fk,
            id_insumo_pk
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el insumo', status: 200 });
        } else {
            res.status(404).json({ message: 'No se actualizó el insumo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar el insumo: ' + e.message, status: 500 });
    }
};

export const eliminarInsumo = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_insumo_pk = req.params.id_insumo_pk;
        const result = await pool.query('DELETE FROM insumos WHERE id_insumo_pk = $1', [id_insumo_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó el insumo', status: 200 });
        } else {
            res.status(404).json({ message: 'No se eliminó el insumo', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar el insumo: ' + e.message, status: 500 });
    }
};
