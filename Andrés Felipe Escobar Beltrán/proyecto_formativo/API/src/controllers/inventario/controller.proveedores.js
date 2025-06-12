import { pool } from '../../database/conexion.js';

export const listarProveedores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Proveedores');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const buscarProveedoresPorId = async (req, res) => {
    try {
        const id_proveedor_pk = req.params.id_proveedor_pk;
        const result = await pool.query('SELECT * FROM Proveedores WHERE id_proveedor_pk = $1', [id_proveedor_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const registrarProveedores = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { nombre_proveedor, direccion__proveedor, email_proveedor, telefono_proveedor } = req.body;
        const sql = 'INSERT INTO Proveedores (nombre_proveedor, direccion__proveedor, email_proveedor, telefono_proveedor) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(sql, [nombre_proveedor, direccion__proveedor, email_proveedor, telefono_proveedor]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const actualizarProveedores = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const { id_proveedor_pk, nombre_proveedor, direccion__proveedor, email_proveedor, telefono_proveedor } = req.body;
        const sql = 'UPDATE Proveedores SET id_proveedor_pk = $1, nombre_proveedor = $2, direccion__proveedor = $3, email_proveedor = $4, telefono_proveedor = $5 WHERE id_proveedor_pk = $6 RETURNING *'
        const result = await pool.query(sql, [id_proveedor_pk, nombre_proveedor, direccion__proveedor, email_proveedor, telefono_proveedor, id_proveedor_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Datos actualizados con exito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontraron proveedores registrados', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};

export const eliminarProveedores = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }
        const id_proveedor_pk = req.params.id_proveedor_pk;
        const result = await pool.query('DELETE FROM Proveedores WHERE id_proveedor_pk = $1 RETURNING *', [id_proveedor_pk]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Datos del proveedor eliminados con exito', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontraron proveedores registrados', status: 404 });
        }

    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda' + e.message, status: 500 });
    }
};