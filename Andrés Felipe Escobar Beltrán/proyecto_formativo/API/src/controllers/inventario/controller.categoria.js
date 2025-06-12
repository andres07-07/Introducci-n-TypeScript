import { pool } from '../../database/conexion.js';

export const listarCategorias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron categorías registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarCategoriaPorId = async (req, res) => {
    try {
        const id_categoria_pk = req.params.id_categoria_pk;
        const result = await pool.query('SELECT * FROM categorias WHERE id_categoria_pk = $1', [id_categoria_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontró la categoría', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};


export const registrarCategoria = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { nombre_categoria, descripcion_categoria } = req.body;
        const sql = 'INSERT INTO categorias (nombre_categoria, descripcion_categoria) VALUES ($1, $2)';
        const result = await pool.query(sql, [nombre_categoria, descripcion_categoria]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se registró la categoría', status: 200 });
        } else {
            res.status(404).json({ message: 'No se registró la categoría', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al realizar el registro: ' + e.message, status: 500 });
    }
};


export const actualizarCategoria = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_categoria_pk = req.params.id_categoria_pk;
        const { nombre_categoria, descripcion_categoria } = req.body;
        const sql = 'UPDATE categorias SET nombre_categoria = $1, descripcion_categoria = $2 WHERE id_categoria_pk = $3';
        const result = await pool.query(sql, [nombre_categoria, descripcion_categoria, id_categoria_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó la categoría', status: 200 });
        } else {
            res.status(404).json({ message: 'No se actualizó la categoría', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar: ' + e.message, status: 500 });
    }
};


export const eliminarCategoria = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_categoria_pk = req.params.id_categoria_pk;
        const sql = 'DELETE FROM categorias WHERE id_categoria_pk = $1';
        const result = await pool.query(sql, [id_categoria_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó la categoría', status: 200 });
        } else {
            res.status(404).json({ message: 'No se eliminó la categoría', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar: ' + e.message, status: 500 });
    }
};
