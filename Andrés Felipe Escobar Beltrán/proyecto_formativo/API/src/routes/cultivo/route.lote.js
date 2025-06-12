import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarLotes,
    buscarLotePorId,
    registrarLote,
    actualizarLote,
    eliminarLote
} from '../../controllers/cultivo/controller.lote.js';

const router = Router();

router.get('/listar', listarLotes);
router.get('/buscar/:id_lote_pk', buscarLotePorId);
router.post('/registrar', registrarLote);
router.put('/actualizar/:id_lote_pk', actualizarLote);
router.delete('/eliminar/:id_lote_pk', eliminarLote);


export default router;
