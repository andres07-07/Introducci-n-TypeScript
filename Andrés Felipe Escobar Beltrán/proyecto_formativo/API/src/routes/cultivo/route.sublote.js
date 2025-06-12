import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarSublotes,
    buscarSublotePorId,
    registrarSublote,
    actualizarSublote,
    eliminarSublote
} from '../../controllers/cultivo/controller.sublote.js';

const router = Router();

router.get('/listar', verificarToken, listarSublotes);
router.get('/buscar/:id_sublote_pk', verificarToken, buscarSublotePorId);
router.post('/registrar', verificarToken, registrarSublote);
router.put('/actualizar/:id_sublote_pk', verificarToken, actualizarSublote);
router.delete('/eliminar/:id_sublote_pk', verificarToken, eliminarSublote);


export default router;
