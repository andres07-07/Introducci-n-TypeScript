import { pool } from '../../database/conexion.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const upload = multer({ dest: 'temp/' });

export const listarEvidencias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM evidencias');
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron evidencias registradas', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};


export const buscarEvidenciasporid = async (req, res) => {
    try {
        const id_evidencia_pk = req.params.id_evidencia_pk;
        const result = await pool.query('SELECT * FROM evidencias WHERE id_evidencia_pk = $1', [id_evidencia_pk]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'no se encontró la evidencia', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'error al realizar la búsqueda: ' + e.message, status: 500 });
    }
};


export const registrarEvidencias = async (req, res) => {
    upload.single('img')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al subir imagen: ' + err.message });
        }

        try {
            console.log('Usuario:', req.usuario);


            const dni = req.usuario.identificacion;
            const nombre = req.usuario.nombre;

            if (!req.file) {
                return res.status(400).json({ message: 'No se envió imagen' });
            }

            const ext = path.extname(req.file.originalname);
            const nombreFinal = `evidencia-${Date.now()}${ext}`;
            const dirDestino = `private/img/${dni}.${nombre}`;
            const rutaFinal = `${dirDestino}/${nombreFinal}`;

            if (!fs.existsSync(dirDestino)) {
                fs.mkdirSync(dirDestino, { recursive: true });
            }

            fs.renameSync(req.file.path, rutaFinal);

            const {
                id_evidencia_pk,
                descripcion_evidencia,
                fecha_evidencia,
                observacion_evidencia,
                fecha_inicio_evidencia,
                fecha_fin_evidencia,
                id_actividad_fk
            } = req.body;

            const sql = `INSERT INTO evidencias 
                (id_evidencia_pk, descripcion_evidencia, fecha_evidencia, observacion_evidencia, 
                fecha_inicio_evidencia, fecha_fin_evidencia, id_actividad_fk, ruta_imagen)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

            const result = await pool.query(sql, [
                id_evidencia_pk,
                descripcion_evidencia,
                fecha_evidencia,
                observacion_evidencia,
                fecha_inicio_evidencia,
                fecha_fin_evidencia,
                id_actividad_fk,
                rutaFinal
            ]);

            if (result.rowCount > 0) {
                res.status(200).json({ message: 'Evidencia registrada correctamente', status: 200 });
            } else {
                res.status(404).json({ message: 'No se pudo registrar', status: 404 });
            }

        } catch (e) {
            res.status(500).json({ message: 'Error interno: ' + e.message });
        }
    });
};
export const actualizarEvidencias = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const { descripcion_evidencia, fecha_evidencia, observacion_evidencia, fecha_inicio_evidencia, fecha_fin_evidencia, id_actividad_fk } = req.body;
        const id_evidencia_pk = req.params.id_evidencia_pk;

        const sql = `UPDATE evidencias SET 
            descripcion_evidencia = $1, 
            fecha_evidencia = $2, 
            observacion_evidencia = $3, 
            fecha_inicio_evidencia = $4, 
            fecha_fin_evidencia = $5, 
            id_actividad_fk = $6
            WHERE id_evidencia_pk = $7`;

        const result = await pool.query(sql, [
            descripcion_evidencia,
            fecha_evidencia,
            observacion_evidencia,
            fecha_inicio_evidencia,
            fecha_fin_evidencia,
            id_actividad_fk,
            id_evidencia_pk
        ]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó la evidencia', status: 200 });
        } else {
            res.status(404).json({ message: 'No se actualizó la evidencia', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al actualizar evidencia: ' + e.message, status: 500 });
    }
};


export const eliminarEvidencias = async (req, res) => {
    try {
        const rolesPermitidos = ['administrador', 'instructor'];

        if (!rolesPermitidos.includes(req.usuario.rol.toLowerCase())) {
            return res.status(403).json({ message: 'acceso denegado: solo administradores o instructores' });
        }

        const id_evidencia_pk = req.params.id_evidencia_pk;
        const sql = 'DELETE FROM evidencias WHERE id_evidencia_pk = $1';
        const result = await pool.query(sql, [id_evidencia_pk]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó la evidencia', status: 200 });
        } else {
            res.status(404).json({ message: 'No se eliminó la evidencia', status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error al eliminar evidencia: ' + e.message, status: 500 });
    }
};
