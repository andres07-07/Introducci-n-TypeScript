import { Router } from 'express';
import { verificarToken } from '../../middlewares/authentication.js'

import{
    listarMovimientosInsumo,
    buscarMovimientosInsumoPorId,
    registrarMovimientosInsumo,
    actualizarMovimientosInsumo,
    eliminarMovimientosInsumo
}from '../../controllers/inventario/controller.movimiento_insumo.js';

const router = Router();

router.get('/listar',verificarToken, listarMovimientosInsumo);
router.get('/buscar/:id_movimiento_insumo_pk',verificarToken, buscarMovimientosInsumoPorId);
router.post('/registrar',verificarToken, registrarMovimientosInsumo);
router.put('/actualizar/:id_movimiento_insumo_pk', verificarToken,actualizarMovimientosInsumo);
router.delete('/eliminar/:id_movimiento_insumo_pk', verificarToken,eliminarMovimientosInsumo);

export default router;