import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarProductos,
    buscarProductoPorId,
    registrarProducto,
    actualizarProducto,
    eliminarProducto
} from '../../controllers/finanzas/controlador.producto.js';

const router = Router();

router.get('/listar', verificarToken, listarProductos);
router.get('/buscar/:id_producto_pk', verificarToken, buscarProductoPorId);
router.post('/registrar', verificarToken, registrarProducto);
router.put('/actualizar/:id_producto_pk', verificarToken, actualizarProducto);
router.delete('/eliminar/:id_producto_pk', verificarToken, eliminarProducto);

export default router;