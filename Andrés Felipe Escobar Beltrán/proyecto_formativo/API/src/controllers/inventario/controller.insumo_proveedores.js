import { pool } from '../../database/conexion.js';

export const listarInsumosProveedores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Insumos_proveedores');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron insumos_proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const buscarInsumosProveedoresPorId = async (req, res) => {
    try {
        const id_insumo_proveedor_pk = req.params.id_insumo_proveedor_pk;
        const result = await pool.query('SELECT * FROM Insumos_proveedores WHERE id_insumo_proveedor_pk = $1', [id_insumo_proveedor_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron insumos_proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const registrarInsumosProveedores = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { id_insumo_fk, id_proveedor_fk } = req.body;
        const sql = 'INSERT INTO Insumos_proveedores (id_insumo_fk, id_proveedor_fk) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(sql, [id_insumo_fk, id_proveedor_fk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron insumos_proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const actualizarInsumosProveedores = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { id_insumo_proveedor_pk, id_insumo_fk, id_proveedor_fk } = req.body;
        const result = await pool.query('UPDATE Insumos_proveedores SET id_insumo_proveedor_pk =$1, id_insumo_fk = $2, id_proveedor_fk = $3 WHERE id_insumos_proveedores_pk = $3 RETURNING *', [id_insumo_proveedor_pk, id_insumo_fk, id_proveedor_fk])
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Datos actualizados con exito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontraron insumos_proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const eliminarInsumosProveedores = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const id_insumo_proveedor_pk = req.params.id_insumo_proveedor_pk;
        const sql = 'DELETE FROM Insumos_proveedores WHERE id_insumo_proveedor_pk = $1 RETURNING *';
        const result = await pool.query(sql, [id_insumo_proveedor_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Datos eliminados con exito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontraron insumos_proveedores registrados', status: 404 });
        }

    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};