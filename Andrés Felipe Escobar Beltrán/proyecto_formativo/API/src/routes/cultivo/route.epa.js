import { Router } from 'express';
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarEpas,
    buscarEpaPorId,
    registrarEpa,
    actualizarEpa,
    eliminarEpa,
    buscarPorNombreTipoEpa,
    buscarNombreEspecifico
} from '../../controllers/cultivo/controller.epa.js';


const router = Router();
router.get('/listar', verificarToken, listarEpas);
router.get('/buscar/:id_epa_pk', verificarToken, buscarEpaPorId);
router.post('/registrar', verificarToken, registrarEpa);
router.put('/actualizar/:id_epa_pk', verificarToken, actualizarEpa);
router.delete('/eliminar/:id_epa_pk', verificarToken, eliminarEpa);
router.get('/tipo/:nombreTipoepa', verificarToken, buscarPorNombreTipoEpa);
router.get('/tipo/:nombreTipoepa/epa/:nombreEspecifico', verificarToken, buscarNombreEspecifico);

router.get('/verificarToken', verificarToken);

export default router;
