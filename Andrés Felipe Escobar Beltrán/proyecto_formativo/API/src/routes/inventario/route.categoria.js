import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
    listarCategorias,
    buscarCategoriaPorId,
    registrarCategoria,
    actualizarCategoria,
    eliminarCategoria
} from '../../controllers/inventario/controller.categoria.js';

const router = Router();

router.get('/listar', verificarToken, listarCategorias);
router.get('/buscar/:id_categoria_pk', verificarToken, buscarCategoriaPorId);
router.post('/registrar', verificarToken, registrarCategoria);
router.put('/actualizar/:id_categoria_pk', verificarToken, actualizarCategoria);
router.delete('/eliminar/:id_categoria_pk', verificarToken, eliminarCategoria);



export default router;
