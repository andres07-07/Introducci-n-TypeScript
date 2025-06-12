import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarInsumos,
    buscarInsumoPorId,
    registrarInsumo,
    actualizarInsumo,
    eliminarInsumo
} from '../../controllers/inventario/controller.insumo.js';

const router = Router();

router.get('/listar', verificarToken, listarInsumos);
router.get('/buscar/:id_insumo_pk', verificarToken, buscarInsumoPorId);
router.post('/registrar', verificarToken, registrarInsumo);
router.put('/actualizar/:id_insumo_pk', verificarToken, actualizarInsumo);
router.delete('/eliminar/:id_insumo_pk', verificarToken, eliminarInsumo);

export default router;
