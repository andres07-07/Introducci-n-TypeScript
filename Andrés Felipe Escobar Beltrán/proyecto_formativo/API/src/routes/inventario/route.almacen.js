import { Router } from 'express';
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarAlmacenes,
    buscarAlmacenPorId,
    registrarAlmacen,
    actualizarAlmacen,
    eliminarAlmacen
} from '../../controllers/inventario/controller.almacen.js';

const router = Router();

router.get('/listar', verificarToken, listarAlmacenes);
router.get('/buscar/:id_almacen_pk', verificarToken, buscarAlmacenPorId);
router.post('/registrar', verificarToken, registrarAlmacen);
router.put('/actualizar/:id_almacen_pk', verificarToken, actualizarAlmacen);
router.delete('/eliminar/:id_almacen_pk', verificarToken, eliminarAlmacen);

export default router;
