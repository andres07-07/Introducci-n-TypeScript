import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarTiposEpa,
    buscarTipoEpaPorId,
    registrarTipoEpa,
    actualizarTipoEpa,
    eliminarTipoEpa
} from '../../controllers/cultivo/controller.tipoepa.js';

const router = Router();
router.get('/listar', verificarToken, listarTiposEpa);
router.get('/buscar/:id_tipo_epa_pk', verificarToken, buscarTipoEpaPorId);
router.post('/registrar', verificarToken, registrarTipoEpa);
router.put('/actualizar/:id_tipo_epa_pk', verificarToken, actualizarTipoEpa);
router.delete('/eliminar/:id_tipo_epa_pk', verificarToken, eliminarTipoEpa);

router.get('/verificarToken', verificarToken);

export default router;  