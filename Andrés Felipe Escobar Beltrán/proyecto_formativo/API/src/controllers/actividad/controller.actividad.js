import { pool } from '../../database/conexion.js';

export const listarActividades = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM actividades');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron actividades registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const buscarActividadesporid = async (req, res) => {
    try {
        const id_actividad_pk = req.params.id_actividad_pk;
        const result = await pool.query('SELECT * FROM actividades WHERE id_actividad_pk = $1', [id_actividad_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró la actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};

export const registrarActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { id_actividad_pk, estado_actividad, descripcion_actividad, nombre_actividad, tiempo_actividad, costo_mano_obra_actividad, fecha_actividad, fecha_inicio_actividad, fecha_fin_actividad, id_tipo_actividad_fk } = req.body;
        const sql = `INSERT INTO actividades (id_actividad_pk, estado_actividad, descripcion_actividad, nombre_actividad, tiempo_actividad, costo_mano_obra_actividad, fecha_actividad, fecha_inicio_actividad, fecha_fin_actividad, id_tipo_actividad_fk)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const result = await pool.query(sql, [id_actividad_pk, estado_actividad, descripcion_actividad, nombre_actividad, tiempo_actividad, costo_mano_obra_actividad, fecha_actividad, fecha_inicio_actividad, fecha_fin_actividad, id_tipo_actividad_fk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se registró la actividad', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró la actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar el registro: ' + e.message, status: 500 });
    }
};

export const actualizarActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { estado_actividad, descripcion_actividad, nombre_actividad, tiempo_actividad, costo_mano_obra_actividad, fecha_actividad, fecha_inicio_actividad, fecha_fin_actividad, id_tipo_actividad_fk } = req.body;
        const id_actividad_pk = req.params.id_actividad_pk;
        const sql = `UPDATE actividades SET estado_actividad = $1, descripcion_actividad = $2, nombre_actividad = $3, tiempo_actividad = $4, costo_mano_obra_actividad = $5, fecha_actividad = $6, fecha_inicio_actividad = $7, fecha_fin_actividad = $8, id_tipo_actividad_fk = $9
                    WHERE id_actividad_pk = $10`;
        const result = await pool.query(sql, [estado_actividad, descripcion_actividad, nombre_actividad, tiempo_actividad, costo_mano_obra_actividad, fecha_actividad, fecha_inicio_actividad, fecha_fin_actividad, id_tipo_actividad_fk, id_actividad_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó la actividad', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó la actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la actualización: ' + e.message, status: 500 });
    }
};

export const eliminarActividades = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_actividad_pk = req.params.id_actividad_pk;
        const sql = 'DELETE FROM actividades WHERE id_actividad_pk = $1';
        const result = await pool.query(sql, [id_actividad_pk]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó la actividad', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó la actividad', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al eliminar: ' + e.message, status: 500 });
    }
};

//RF12 - Asignación de Actividades
export const asignarActividad = async (req, res) => {
    try {
        const { id_actividad, dni_aprendiz } = req.body;

        // verificacion de roles(solo instructor)
        if (req.usuario.rol.toLowerCase() !== 'instructor') {
            return res.status(403).json({
                message: 'Acceso denegado: solo instructores pueden asignar actividades',
                status: 403
            });
        }

        //verfificacion de que existe el aprendiz
        const aprendiz = await pool.query(
            `SELECT u.dni_usuario_pk, r.nombre_rol, u.nombre_usuario
             FROM usuarios u
             JOIN roles r ON u.id_rol_fk = r.id_rol_pk
             WHERE u.dni_usuario_pk = $1`,
            [dni_aprendiz]
        );

        if (aprendiz.rows.length === 0 || aprendiz.rows[0].nombre_rol.toLowerCase() !== 'aprendiz') {
            return res.status(400).json({
                message: 'El usuario asignado no es un aprendiz válido',
                status: 400
            });
        }

        //verificacion de que existe la actividad
        const actividad = await pool.query(
            `SELECT nombre_actividad
             FROM actividades
             WHERE id_actividad_pk = $1`,
            [id_actividad]
        );

        if (actividad.rows.length === 0) {
            return res.status(404).json({
                message: 'Actividad no encontrada',
                status: 404
            });
        }

        // insertar en tabla de usuarios_actividades
        await pool.query(
            `INSERT INTO usuarios_actividades (dni_usuario_fk, id_actividad_fk)
             VALUES ($1, $2)`,
            [dni_aprendiz, id_actividad]
        );

        res.status(200).json({
            message: `Actividad ${actividad.rows[0].nombre_actividad} asignada a aprendiz ${aprendiz.rows[0].nombre_usuario}`,
            status: 200
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al asignar actividad: ' + error.message,
            status: 500
        });
    }
};


//ver actividades por aprendiz
export const verActividadesAsignadas = async (req, res) => {
    try {
        const { dni } = req.params;

        const rol = req.usuario.rol.toLowerCase();
        if (rol !== 'administrador' && rol !== 'instructor') {
            return res.status(403).json({ message: 'Acceso denegado: solo administradores e instructores pueden ver actividades asignadas' });
        }

        const resultado = await pool.query(
            `SELECT a.id_actividad_pk, a.nombre_actividad, a.descripcion_actividad, 
                    a.fecha_actividad, a.estado_actividad, 
                    ta.nombre_tipo_actividad
             FROM usuarios_actividades ua
             JOIN actividades a ON ua.id_actividad_fk = a.id_actividad_pk
             LEFT JOIN tipos_actividades ta ON a.id_tipo_actividad_fk = ta.id_tipo_actividad_pk
             WHERE ua.dni_usuario_fk = $1`,
            [dni]
        );

        res.status(200).json({ actividades: resultado.rows, cantidad: resultado.rowCount, status: 200 });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener actividades: ' + error.message, status: 500 });
    }
};
