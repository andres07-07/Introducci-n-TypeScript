import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarMovimientosProducto,
    buscarMovimientoProductoPorId,
    registrarMovimientoProducto,
    actualizarMovimientoProducto,
    eliminarMovimientoProducto
} from '../../controllers/finanzas/controlador.movimiento_producto.js';

const router = Router();

// Rutas CRUD para movimientos de productos
router.get('/listar', verificarToken, listarMovimientosProducto);
router.get('/buscar/:id_movimiento_producto_pk', verificarToken, buscarMovimientoProductoPorId);
router.post('/registrar', verificarToken, registrarMovimientoProducto);
router.put('/actualizar/:id_movimiento_producto_pk', verificarToken, actualizarMovimientoProducto);
router.delete('/eliminar/:id_movimiento_producto_pk', verificarToken, eliminarMovimientoProducto);

export default router;