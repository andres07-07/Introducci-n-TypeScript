import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js'
import {
    listarEvidencias,
    buscarEvidenciasporid,
    registrarEvidencias,
    actualizarEvidencias,
    eliminarEvidencias
} from '../../controllers/actividad/controller.evidencia.js';

const router = Router();

router.get('/listar', verificarToken, listarEvidencias);
router.get('/buscar/:id_evidencia_pk', verificarToken, buscarEvidenciasporid);
router.post('/registrar', verificarToken, registrarEvidencias);
router.put('/actualizar/:id_evidencia_pk', verificarToken, actualizarEvidencias);
router.delete('/eliminar/:id_evidencia_pk', verificarToken, eliminarEvidencias);


export default router;