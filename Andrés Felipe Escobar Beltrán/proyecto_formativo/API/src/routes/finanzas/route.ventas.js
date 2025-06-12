import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarVentas,
    buscarVentaPorId,
    registrarVenta,
    actualizarVenta,
    eliminarVenta
} from '../../controllers/finanzas/controlador.ventas.js';

const router = Router();

router.get('/listar', verificarToken, listarVentas);
router.get('/buscar/:id_ventas_pk', verificarToken, buscarVentaPorId);
router.post('/registrar', verificarToken, registrarVenta);
router.put('/actualizar/:id_ventas_pk', verificarToken, actualizarVenta);
router.delete('/eliminar/:id_ventas_pk', verificarToken, eliminarVenta);

export default router;