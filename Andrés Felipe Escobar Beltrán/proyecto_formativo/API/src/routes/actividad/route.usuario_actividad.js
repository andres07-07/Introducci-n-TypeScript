import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js'
import {
    listarUsuarioActividad,
    buscarUsuarioActividadporid,
    registrarUsuarioActividad,
    actualizarUsuarioActividad,
    eliminarUsuarioActividad
} from '../../controllers/actividad/controller.usuario_actividad.js';

const router = Router();

router.get('/listar', verificarToken, listarUsuarioActividad);
router.get('/buscar/:id_usuarios_actividades_pk', verificarToken, buscarUsuarioActividadporid);
router.post('/registrar', registrarUsuarioActividad);
router.put('/actualizar/:id_usuarios_actividades_pk', verificarToken, actualizarUsuarioActividad);
router.delete('/eliminar/:id_usuarios_actividades_pk', verificarToken, eliminarUsuarioActividad);


export default router;