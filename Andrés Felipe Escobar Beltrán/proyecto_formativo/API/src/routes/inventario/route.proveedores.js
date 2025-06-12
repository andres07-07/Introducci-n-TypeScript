import { Router } from 'express';
import { verificarToken } from '../../middlewares/authentication.js'

import {
    listarProveedores,
    buscarProveedoresPorId,
    registrarProveedores,
    actualizarProveedores,
    eliminarProveedores
}

    from '../../controllers/inventario/controller.proveedores.js';

const router = Router();

router.get('/listar', verificarToken, listarProveedores);
router.get('/buscar/:id_proveedor_pk', verificarToken, buscarProveedoresPorId);
router.post('/registrar', verificarToken, registrarProveedores);
router.put('/actualizar/:id_proveedor_pk', verificarToken, actualizarProveedores);
router.delete('/eliminar/:id_proveedor_pk', verificarToken, eliminarProveedores);


export default router;