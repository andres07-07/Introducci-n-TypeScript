import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js'
import {
    listartipoActividades,
    buscartipoActividadesporid,
    registrartipoActividades,
    actualizartipoActividades,
    eliminartipoActividades
} from '../../controllers/actividad/controller.tipoactividad.js';

const router = Router();

router.get('/listar', verificarToken, listartipoActividades);
router.get('/buscar/:id_tipo_actividad_pk', verificarToken, buscartipoActividadesporid);
router.post('/registrar', verificarToken, registrartipoActividades);
router.put('/actualizar/:id_tipo_actividad_pk', verificarToken, actualizartipoActividades);
router.delete('/eliminar/:id_tipo_actividad_pk', verificarToken, eliminartipoActividades);


export default router;