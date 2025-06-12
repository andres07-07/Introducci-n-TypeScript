import { Router } from 'express';
import { verificarToken } from '../../middlewares/authentication.js'

import {
    listarInsumosProveedores,
    buscarInsumosProveedoresPorId,
    registrarInsumosProveedores,
    actualizarInsumosProveedores,
    eliminarInsumosProveedores
}

    from '../../controllers/inventario/controller.insumo_proveedores.js';

const router = Router();

router.get('/listar', verificarToken, listarInsumosProveedores);
router.get('/buscar/:id_insumo_proveedor_pk', verificarToken, buscarInsumosProveedoresPorId);
router.post('/registrar', verificarToken, registrarInsumosProveedores);
router.put('/actualizar/:id_insumo_proveedor_pk', verificarToken, actualizarInsumosProveedores);
router.delete('/eliminar/:id_insumo_proveedor_pk', verificarToken, eliminarInsumosProveedores);

export default router;