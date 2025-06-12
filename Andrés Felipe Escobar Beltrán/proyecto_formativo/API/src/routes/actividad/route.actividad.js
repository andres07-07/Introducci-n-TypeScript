import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js'
import {
    listarActividades,
    buscarActividadesporid,
    registrarActividades,
    actualizarActividades,
    eliminarActividades,
    asignarActividad,
    verActividadesAsignadas
} from '../../controllers/actividad/controller.actividad.js';


const router = Router();

router.get('/listar', verificarToken, listarActividades);
router.get('/buscar/:id_actividad_pk', verificarToken, buscarActividadesporid);
router.post('/registrar', verificarToken, registrarActividades);
router.put('/actualizar/:id_actividad_pk', verificarToken, actualizarActividades);
router.delete('/eliminar/:id_actividad_pk', verificarToken, eliminarActividades);
router.post('/asignar_actividad', verificarToken, asignarActividad);
router.get('/actividades_asignadas/:dni', verificarToken, verActividadesAsignadas);



export default router;