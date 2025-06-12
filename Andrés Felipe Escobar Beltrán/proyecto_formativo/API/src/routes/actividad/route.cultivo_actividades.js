import { Router } from 'express';
import { verificarToken } from '../../middlewares/authentication.js'

import {
    listarCultivosActividades,
    buscarCultivosActividadesPorId,
    registrarCultivosActividades,
    actualizarCultivosActividades,
    eliminarCultivosActividades
}

    from '../../controllers/actividad/controller.cultivo_actividad.js';

const router = Router();

router.get('/listar', verificarToken, listarCultivosActividades);
router.get('/buscar/:id_cultivo_actividad_pk', verificarToken, buscarCultivosActividadesPorId);
router.post('/registrar', verificarToken, registrarCultivosActividades);
router.put('/actualizar/:id_cultivo_actividad_pk', verificarToken, actualizarCultivosActividades);
router.delete('/eliminar/:id_cultivo_actividad_pk', verificarToken, eliminarCultivosActividades);


export default router;